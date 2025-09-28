-- MIM MVP Seed Data

-- Insert initial daily prompts
INSERT OR IGNORE INTO daily_prompts (prompt_text, date_assigned) VALUES 
  ('What are you afraid to say out loud today?', '2025-09-28'),
  ('What pattern in your life are you ready to break?', '2025-09-29'),
  ('What would you tell your younger self right now?', '2025-09-30'),
  ('What truth about yourself have you been avoiding?', '2025-10-01'),
  ('What boundaries do you need to set today?', '2025-10-02'),
  ('What are you pretending not to know?', '2025-10-03'),
  ('How are you sabotaging your own growth?', '2025-10-04');

-- Create a test user for development
INSERT OR IGNORE INTO users (first_name, email) VALUES 
  ('Test', 'test@mim.app');