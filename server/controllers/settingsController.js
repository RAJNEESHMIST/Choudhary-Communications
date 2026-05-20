import {
  getSettings,
  updateSettings
} from '../repositories/settingsRepository.js';

export async function readSettings(req, res) {
  const settings = await getSettings();
  res.json(settings);
}

export async function changeSettings(req, res) {
  const settings = await updateSettings(req.body);
  res.json(settings);
}
