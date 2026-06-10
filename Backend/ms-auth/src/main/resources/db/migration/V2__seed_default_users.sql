INSERT INTO users (username, password, email, role)
VALUES
    ('gerente', '1234', 'gerente@cordillera.cl', 'Gerente'),
    ('supervisor', '1234', 'supervisor@cordillera.cl', 'Supervisor'),
    ('vendedor', '1234', 'vendedor@cordillera.cl', 'Vendedor')
ON CONFLICT (username) DO NOTHING;
