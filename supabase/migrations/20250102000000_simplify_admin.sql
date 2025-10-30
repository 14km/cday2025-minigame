-- Simplify Admin System
-- Remove admin_users table and permissions column
-- Admin access is now based solely on profiles.role

-- 1. Drop admin_users table (no longer needed)
DROP TABLE IF EXISTS admin_users CASCADE;

-- 2. Remove permissions column from profiles (if exists)
ALTER TABLE profiles DROP COLUMN IF EXISTS permissions;

-- 3. Ensure role column has correct values
-- role can be: 'user', 'admin', 'super_admin'
-- No additional permissions table needed

-- Admin access is now simply:
-- - role = 'admin' OR role = 'super_admin'
-- - All admins have full access to all admin functions
