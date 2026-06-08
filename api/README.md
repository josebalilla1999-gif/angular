# API local

Esta carpeta contiene la API PHP que conecta con MySQL/MariaDB desde WAMP.

Endpoint de prueba:

```text
http://localhost/angular/api/health.php
```

Valores por defecto de conexion:

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=sistema_reservaciones
DB_USER=root
DB_PASS=
```

Si tu usuario o password de MySQL son distintos, actualiza `api/config/database.php`
o define esas variables de entorno en Apache/WAMP.
