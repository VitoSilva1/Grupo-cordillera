INSERT INTO users (username, email, password, first_name, last_name, role)
VALUES
    ('gerente', 'gerente@cordillera.cl', '1234', 'Gerente', 'Cordillera', 'Gerente'),
    ('supervisor', 'supervisor@cordillera.cl', '1234', 'Supervisor', 'Cordillera', 'Supervisor'),
    ('vendedor', 'vendedor@cordillera.cl', '1234', 'Vendedor', 'Cordillera', 'Vendedor')
ON CONFLICT (username) DO UPDATE
SET email = EXCLUDED.email,
    password = EXCLUDED.password,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role;
