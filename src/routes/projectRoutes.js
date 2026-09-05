import { Router } from 'express';
import {
  getProjects,
  getProjectBySlugOrId,
  createProject,
  updateProject,
  togglePublishProject,
  deleteProject,
  getProjectUnits,
  createProjectUnit,
  updateProjectUnit,
  deleteProjectUnit,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', getProjects);
router.get('/:identifier', getProjectBySlugOrId);
router.get('/:projectId/units', getProjectUnits);

// Protected Admin routes
router.post('/', protect, authorize('admin', 'superadmin'), createProject);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateProject);
router.patch('/:id/publish', protect, authorize('admin', 'superadmin'), togglePublishProject);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProject);

// Unit management routes
router.post('/:projectId/units', protect, authorize('admin', 'superadmin'), createProjectUnit);
router.put('/units/:unitId', protect, authorize('admin', 'superadmin'), updateProjectUnit);
router.delete('/units/:unitId', protect, authorize('admin', 'superadmin'), deleteProjectUnit);

export default router;
