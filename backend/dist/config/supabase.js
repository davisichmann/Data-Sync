"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using Service Role Key for backend ops
if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Missing Supabase URL or Key in environment variables. DB operations will fail.');
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl || '', supabaseKey || '');
