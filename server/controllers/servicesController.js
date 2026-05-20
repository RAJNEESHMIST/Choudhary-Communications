import {
  getAllServices,
  createService,
  updateService,
  deleteService
} from '../repositories/servicesRepository.js';

export async function listServices(req, res) {
  const services = await getAllServices();
  res.json(services);
}

export async function addService(req, res) {
  const service = await createService(req.body);
  res.status(201).json(service);
}

export async function editService(req, res) {
  const service = await updateService(req.params.id, req.body);
  res.json(service);
}

export async function removeService(req, res) {
  const result = await deleteService(req.params.id);
  res.json(result);
}
