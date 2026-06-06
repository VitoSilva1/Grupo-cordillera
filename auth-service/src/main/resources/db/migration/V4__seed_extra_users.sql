INSERT INTO users (username, password, email, role) VALUES
    ('analista',  '1234', 'analista@cordillera.cl',  'Analista'),
    ('admin',     '1234', 'admin@cordillera.cl',     'Gerente'),
    ('jefe_vtas', '1234', 'jefevtas@cordillera.cl',  'Supervisor')
ON CONFLICT (username) DO NOTHING;
