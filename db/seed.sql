INSERT INTO medications(name, no_pos) VALUES
('Acetaminofén 500mg', false),
('Ibuprofeno 400mg', false),
('Medicamento Especial X', true),
('Tratamiento Y', true)
ON CONFLICT DO NOTHING;
