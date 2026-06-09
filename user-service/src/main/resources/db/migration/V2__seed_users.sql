INSERT INTO users (username, email, password, first_name, last_name, role) VALUES
    ('gerente',      'gerente@cordillera.cl',      '1234', 'Carlos',    'Mendoza',    'Gerente'),
    ('supervisor',   'supervisor@cordillera.cl',   '1234', 'Ana',       'Rodríguez',  'Supervisor'),
    ('vendedor',     'vendedor@cordillera.cl',      '1234', 'Luis',      'Pérez',      'Vendedor'),
    ('analista',     'analista@cordillera.cl',      '1234', 'Sofía',     'Torres',     'Analista'),
    ('admin',        'admin@cordillera.cl',         '1234', 'Miguel',    'Sánchez',    'Gerente'),
    ('jefe_vtas',    'jefevtas@cordillera.cl',      '1234', 'Patricia',  'Villanueva', 'Supervisor'),
    ('vendedor2',    'vendedor2@cordillera.cl',     '1234', 'Diego',     'Herrera',    'Vendedor'),
    ('vendedor3',    'vendedor3@cordillera.cl',     '1234', 'Valentina', 'Castro',     'Vendedor'),
    ('analista2',    'analista2@cordillera.cl',     '1234', 'Roberto',   'Morales',    'Analista'),
    ('supervisor2',  'supervisor2@cordillera.cl',   '1234', 'Claudia',   'Espinoza',   'Supervisor'),
    ('vendedor4',    'vendedor4@cordillera.cl',     '1234', 'Andrés',    'Flores',     'Vendedor'),
    ('operador',     'operador@cordillera.cl',      '1234', 'Fernanda',  'Gutiérrez',  'Vendedor')
ON CONFLICT (username) DO NOTHING;
