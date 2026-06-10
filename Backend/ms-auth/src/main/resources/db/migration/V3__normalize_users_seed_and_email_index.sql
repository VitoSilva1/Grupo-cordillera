UPDATE users u
SET email = LOWER(TRIM(u.email))
WHERE u.email IS NOT NULL
  AND u.email <> LOWER(TRIM(u.email))
  AND NOT EXISTS (
      SELECT 1
      FROM users x
      WHERE x.username <> u.username
        AND LOWER(TRIM(x.email)) = LOWER(TRIM(u.email))
  );

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM (
            SELECT LOWER(TRIM(email)) AS normalized_email, COUNT(*) AS cnt
            FROM users
            GROUP BY LOWER(TRIM(email))
            HAVING COUNT(*) > 1
        ) dup
    ) THEN
        CREATE UNIQUE INDEX IF NOT EXISTS ux_users_email_lower
            ON users (LOWER(email));
    END IF;
END $$;

INSERT INTO users (username, password, email, role)
VALUES
    ('gerente', '1234', 'gerente@cordillera.cl', 'Gerente'),
    ('supervisor', '1234', 'supervisor@cordillera.cl', 'Supervisor'),
    ('vendedor', '1234', 'vendedor@cordillera.cl', 'Vendedor')
ON CONFLICT (username) DO UPDATE
SET password = EXCLUDED.password,
    email = EXCLUDED.email,
    role = EXCLUDED.role;
