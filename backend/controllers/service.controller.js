import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Service from '../models/Service.model.js';

const DB_FILE = path.join(process.cwd(), 'backend', 'data', 'db.json');

const getLocalServices = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return data.services || [];
    }
  } catch {
    return [];
  }
  return [];
};

const saveLocalServices = (services) => {
  try {
    let data = {};
    if (fs.existsSync(DB_FILE)) {
      data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
    data.services = services;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local services:', err.message);
  }
};

const getAllServices = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const services = await Service.find().sort({ order: 1, createdAt: -1 });
      return res.status(200).json({ services });
    }
    const services = getLocalServices();
    return res.status(200).json({ services });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      category,
      realProblem,
      description,
      features,
      successLooksLike,
      icon,
      image,
      isActive,
      order,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const slug =
      req.body.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const parsedFeatures = Array.isArray(features)
      ? features
      : typeof features === 'string'
      ? features.split(',').map((f) => f.trim()).filter(Boolean)
      : [];

    if (mongoose.connection.readyState === 1) {
      const service = await Service.create({
        title,
        slug,
        subtitle: subtitle || '',
        category: category || 'Phase 1: Getting Started',
        realProblem: realProblem || '',
        description: description || '',
        features: parsedFeatures,
        successLooksLike: successLooksLike || '',
        icon: icon || 'Rocket',
        image: image || '',
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      });
      return res.status(201).json({ message: 'Service created', service });
    }

    const services = getLocalServices();
    const newService = {
      _id: 'srv_' + Date.now(),
      title,
      slug,
      subtitle: subtitle || '',
      category: category || 'Phase 1: Getting Started',
      realProblem: realProblem || '',
      description: description || '',
      features: parsedFeatures,
      successLooksLike: successLooksLike || '',
      icon: icon || 'Rocket',
      image: image || '',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      createdAt: new Date().toISOString(),
    };
    services.unshift(newService);
    saveLocalServices(services);
    return res.status(201).json({ message: 'Service created', service: newService });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    if (body.features && typeof body.features === 'string') {
      body.features = body.features.split(',').map((f) => f.trim()).filter(Boolean);
    }

    if (mongoose.connection.readyState === 1) {
      const service = await Service.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (!service) return res.status(404).json({ message: 'Service not found' });
      return res.status(200).json({ message: 'Service updated', service });
    }

    const services = getLocalServices();
    const idx = services.findIndex((s) => s._id === id || s.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Service not found' });

    services[idx] = {
      ...services[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    saveLocalServices(services);
    return res.status(200).json({ message: 'Service updated', service: services[idx] });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const service = await Service.findByIdAndDelete(id);
      if (!service) return res.status(404).json({ message: 'Service not found' });
      return res.status(200).json({ message: 'Service deleted' });
    }

    let services = getLocalServices();
    const exists = services.some((s) => s._id === id || s.id === id);
    if (!exists) return res.status(404).json({ message: 'Service not found' });

    services = services.filter((s) => s._id !== id && s.id !== id);
    saveLocalServices(services);
    return res.status(200).json({ message: 'Service deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default { getAllServices, createService, updateService, deleteService };
