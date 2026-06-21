/**
 * src/lib/format.js — helper định dạng hiển thị (presentation, không có DOM).
 */
import { SLOT_LABEL } from './config.js';

/** Nhãn slot bỏ emoji, dùng trong dòng text chi tiết. vd "☀️ Sáng" → "Sáng" */
export const slotText = (slot) => SLOT_LABEL[slot].replace(/[^\w\s]/gu, '').trim();
