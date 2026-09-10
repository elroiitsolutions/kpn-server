import { Op } from 'sequelize';
import Enquiry from '../models/Enquiry.js';
import Project from '../models/Project.js';
import { notificationService } from '../services/notificationService.js';

export const getEnquiries = async (req, res, next) => {
  try {
    const { status, project, search, unitNumber, contested, page = 1, limit = 50 } = req.query;
    const where = {};

    if (status && status !== 'All') {
      where.status = status;
    }

    if (project) {
      where.projectId = project;
    }

    if (unitNumber) {
      where.unitNumber = unitNumber;
    }

    if (contested === 'true') {
      const [multiUnitRows] = await Enquiry.sequelize.query(
        "SELECT unitNumber FROM enquiries WHERE unitNumber IS NOT NULL AND unitNumber != '' GROUP BY unitNumber HAVING COUNT(*) > 1"
      );
      const contestedUnits = multiUnitRows.map((r) => r.unitNumber);
      where.unitNumber = { [Op.in]: contestedUnits.length > 0 ? contestedUnits : ['__no_contested_units__'] };
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${String(search).trim()}%` } },
        { phone: { [Op.like]: `%${String(search).trim()}%` } },
        { email: { [Op.like]: `%${String(search).trim()}%` } },
        { projectName: { [Op.like]: `%${String(search).trim()}%` } },
        { unitNumber: { [Op.like]: `%${String(search).trim()}%` } },
        { block: { [Op.like]: `%${String(search).trim()}%` } },
      ];
    }

    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 50;
    const offset = (pageNum - 1) * limitNum;

    const { rows: enquiries, count: total } = await Enquiry.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset,
    });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: enquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const createEnquiry = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required to submit an enquiry.',
      });
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required to submit an enquiry.',
      });
    }

    const payload = {
      ...req.body,
      projectId: req.body.project || req.body.projectId,
    };

    const enquiry = await Enquiry.create(payload);

    // Fire non-blocking asynchronous notifications
    notificationService.dispatchAll(enquiry).catch((err) => {
      console.warn('[Notification Error]:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our sales team will contact you shortly.',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, assignedStaff } = req.body;
    const updatePayload = {};

    if (status) updatePayload.status = status;
    if (assignedStaff) updatePayload.assignedStaff = assignedStaff;

    const enquiry = await Enquiry.findByPk(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    await enquiry.update(updatePayload);

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const addEnquiryNote = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty' });
    }

    const enquiry = await Enquiry.findByPk(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    const currentNotes = Array.isArray(enquiry.notes) ? [...enquiry.notes] : [];
    currentNotes.push({
      author: req.user ? req.user.name : 'Staff Advisor',
      text,
      createdAt: new Date(),
    });

    enquiry.notes = currentNotes;
    await enquiry.save();

    res.status(200).json({
      success: true,
      data: enquiry.notes,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByPk(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    await enquiry.destroy();

    res.status(200).json({
      success: true,
      message: 'Enquiry record deleted',
    });
  } catch (error) {
    next(error);
  }
};

export const allocateUnit = async (req, res, next) => {
  try {
    const {
      projectId,
      unitNumber,
      unitId,
      blockId,
      floorNumber,
      plotId,
      enquiryId,
      action = 'booked', // 'booked' | 'sold' | 'release'
    } = req.body;

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'projectId is required' });
    }

    if (!unitNumber && !unitId && !plotId) {
      return res.status(400).json({ success: false, message: 'unitNumber or plotId is required' });
    }

    // Find Project
    let project = await Project.findByPk(projectId);
    if (!project) {
      project = await Project.findOne({ where: { slug: projectId } });
    }
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    let targetEnquiry = null;
    if (enquiryId) {
      targetEnquiry = await Enquiry.findByPk(enquiryId);
    }

    const isRelease = action === 'release';
    const targetUnitStatus = isRelease ? 'available' : (action === 'sold' ? 'sold' : 'booked');

    let updatedUnitObj = null;
    let found = false;

    // Helper to test if unit matches
    const isMatchingUnit = (u) => {
      if (unitId && u.unitId === unitId) return true;
      if (unitNumber) {
        const cleanReq = String(unitNumber).replace(/^(Villa|Plot|Unit)\s+/i, '').trim().toLowerCase();
        const cleanUnit = String(u.unitNumber).replace(/^(Villa|Plot|Unit)\s+/i, '').trim().toLowerCase();
        if (cleanReq === cleanUnit) return true;
        if (String(u.unitNumber).toLowerCase() === String(unitNumber).toLowerCase()) return true;
      }
      return false;
    };

    const safeParse = (val, fallback) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return fallback;
        }
      }
      return Array.isArray(val) ? val : fallback;
    };

    let parsedBlocks = safeParse(project.blocks, []);
    let parsedPlots = safeParse(project.plots, []);

    // 1. Check blocks -> floors -> units
    if (Array.isArray(parsedBlocks) && parsedBlocks.length > 0) {
      for (const blk of parsedBlocks) {
        if (blockId && blk.blockId !== blockId) continue;
        for (const flr of (blk.floors || [])) {
          if (floorNumber !== undefined && Number(flr.floorNumber) !== Number(floorNumber)) continue;
          for (const u of (flr.units || [])) {
            if (isMatchingUnit(u)) {
              u.status = targetUnitStatus;
              if (isRelease) {
                delete u.bookedTo;
              } else if (targetEnquiry) {
                u.bookedTo = {
                  enquiryId: targetEnquiry.id,
                  customerName: targetEnquiry.name,
                  customerPhone: targetEnquiry.phone,
                  customerEmail: targetEnquiry.email || '',
                  action: action,
                  allocatedAt: new Date().toISOString(),
                };
              }
              updatedUnitObj = u;
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (found) break;
      }
      if (found) {
        project.blocks = parsedBlocks;
        project.changed('blocks', true);
      }
    }

    // 2. Check plots if not found in blocks
    if (!found && Array.isArray(parsedPlots) && parsedPlots.length > 0) {
      for (const p of parsedPlots) {
        const cleanReq = String(unitNumber || plotId).replace(/^(Villa|Plot|Unit)\s+/i, '').trim().toLowerCase();
        const cleanPlot = String(p.plotNumber || p.plotId).replace(/^(Villa|Plot|Unit)\s+/i, '').trim().toLowerCase();
        const matchesPlot = (plotId && p.plotId === plotId) || cleanReq === cleanPlot;

        if (matchesPlot) {
          p.status = targetUnitStatus;
          if (isRelease) {
            delete p.bookedTo;
          } else if (targetEnquiry) {
            p.bookedTo = {
              enquiryId: targetEnquiry.id,
              customerName: targetEnquiry.name,
              customerPhone: targetEnquiry.phone,
              customerEmail: targetEnquiry.email || '',
              action: action,
              allocatedAt: new Date().toISOString(),
            };
          }
          updatedUnitObj = p;
          found = true;
          break;
        }
      }
      if (found) {
        project.plots = parsedPlots;
        project.changed('plots', true);
      }
    }

    // Recalculate Project inventory stats
    const allUnits = [];
    (parsedBlocks || []).forEach((b) => {
      (b.floors || []).forEach((f) => {
        (f.units || []).forEach((u) => allUnits.push(u));
      });
    });
    if (allUnits.length > 0) {
      project.totalUnits = allUnits.length;
      project.availableUnits = allUnits.filter((u) => u.status === 'available' || !u.status).length;
      project.bookedUnits = allUnits.filter((u) => u.status === 'booked').length;
      project.soldUnits = allUnits.filter((u) => u.status === 'sold').length;
      project.blockedUnits = allUnits.filter((u) => u.status === 'blocked').length;
    } else if (Array.isArray(parsedPlots) && parsedPlots.length > 0) {
      project.totalUnits = parsedPlots.length;
      project.availableUnits = parsedPlots.filter((p) => p.status === 'available' || !p.status).length;
      project.bookedUnits = parsedPlots.filter((p) => p.status === 'booked').length;
      project.soldUnits = parsedPlots.filter((p) => p.status === 'sold').length;
      project.blockedUnits = parsedPlots.filter((p) => p.status === 'blocked').length;
    }

    project.version = Number(project.version || 1) + 1;
    await project.save();

    // 3. Update Enquiries
    const targetUnitLabel = unitNumber || (updatedUnitObj ? (updatedUnitObj.unitNumber || updatedUnitObj.plotNumber) : '');
    const cleanUnitNum = String(targetUnitLabel).replace(/^(Villa|Plot|Unit)\s+/i, '').trim();

    if (!isRelease && targetEnquiry) {
      // Set chosen lead's status
      targetEnquiry.status = action === 'sold' ? 'Sold' : 'Booked';
      const notes = Array.isArray(targetEnquiry.notes) ? [...targetEnquiry.notes] : [];
      notes.push({
        author: req.user ? req.user.name : 'System Admin',
        text: `Unit ${targetUnitLabel} successfully ${action} for ${targetEnquiry.name} by admin.`,
        createdAt: new Date(),
      });
      targetEnquiry.notes = notes;
      await targetEnquiry.save();

      // Find other competing enquiries for the same unit & project
      const competingEnquiries = await Enquiry.findAll({
        where: {
          id: { [Op.ne]: targetEnquiry.id },
          [Op.or]: [
            { projectId: project.id },
            { projectName: project.name },
          ],
          [Op.or]: [
            { unitNumber: targetUnitLabel },
            { unitNumber: cleanUnitNum },
            { unitNumber: { [Op.like]: `%${cleanUnitNum}%` } },
          ],
          status: { [Op.notIn]: ['Booked', 'Sold', 'Closed'] },
        },
      });

      for (const comp of competingEnquiries) {
        comp.status = 'Waitlisted';
        const compNotes = Array.isArray(comp.notes) ? [...comp.notes] : [];
        compNotes.push({
          author: req.user ? req.user.name : 'System Admin',
          text: `Unit ${targetUnitLabel} has been ${action} to another buyer (${targetEnquiry.name}). Customer waitlisted for alternative units.`,
          createdAt: new Date(),
        });
        comp.notes = compNotes;
        await comp.save();
      }
    } else if (isRelease && targetEnquiry) {
      targetEnquiry.status = 'Contacted';
      const notes = Array.isArray(targetEnquiry.notes) ? [...targetEnquiry.notes] : [];
      notes.push({
        author: req.user ? req.user.name : 'System Admin',
        text: `Unit ${targetUnitLabel} allocation was released back to Available.`,
        createdAt: new Date(),
      });
      targetEnquiry.notes = notes;
      await targetEnquiry.save();
    }

    res.status(200).json({
      success: true,
      message: isRelease
        ? `Unit ${targetUnitLabel} allocation released back to Available`
        : `Unit ${targetUnitLabel} successfully ${action} to ${targetEnquiry ? targetEnquiry.name : 'customer'}`,
      data: {
        project,
        unit: updatedUnitObj,
        enquiry: targetEnquiry,
      },
    });
  } catch (error) {
    next(error);
  }
};
