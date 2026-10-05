# Instrucciones de instalacion y ejecucion

-----
#### !IMPORTANTE!: DEBES TENER DOCKER DESKTOP ABIERTO PARA QUE LOS COMANDOS FUNCIONEN
-----

La primera vez que se ejecute este comando, se encargara de construir, compilar y buildear todos los archivos necesarios para ejecutar tanto la base de datos, la api y la pagina web.
```sh
docker compose up
```
Antes de finalizar el trabajo asegurate de ejecutar el comando, para finalizar los procesos de forma segura
```sh
docker compose down
```

# Instrucciones de prueba

## Cambios y pruebas de funcionalidad
Cada vez que realices cambios en el codigo, debes de asegurarte de realizar los siguientes pasos en la terminal:
1. ``docker compose down`` 
2. ``docker compose build`` 
3. ``docker compose up`` 

## Pruebas de sistemas, ficheros y otros
Para poder probar un modulo en particular (frontend, backend, base de datos) se debe acceder mediante la __terminal probista por Docker__:

1. Con la sesión de docker abierta, presiona sobre el nombre de uno de los contenedores: react_client (frontend), api_server (backend), postgres_db (base de datos)
2. Luego selecciona la pestaña "Exec"
3. Ejecuta los comandos de debuggeacion que consideres apropiado

![ejemplo contenedores 1](readme_src\ejemplo_terminal_docker.png)

![ejemplo contenedores 2](readme_src\ejemplo_terminal_docker_1.png)

![ejemplo contenedores 3](readme_src\ejemplo_terminal_docker_2.png)

## ¿Cómo supervisar y gestionar la base de datos postgres con dbeaver?

El proceso no es tan diferente como se conectaba uno en los laboratorios de Taller de Base de datos. Debes buscar el archivo ".env" en la carpeta principal del proyecto.

Ahí encontraras los valores de los campos POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, DB_HOST, DB_PORT necesarios para ingresarlo en la configuración de conexión de Dbeaver, en caso de mas preguntas consultar a Emilio o Enri.

## Comandos de prueba DJango

Este apartado cubre los principales tareas que uno debe realizar para que Django haga lo que uno espera que haga.

---

__!Los siguientes comandos deben ser ejecutados en la terminal del contenedor de docker!__

---

### 1. Sobre las Migraciones
Cada vez que se hagan cambios en los ficheros ``models.py`` uno debe asegurarse de indicarle a Django sobre estos cambios:
```sh
python manage.py makemigrations
```

### 2. Sobre actualizar la base de datos
Por defecto cada vez que el servidor es reiniciado (ya sea mediante ```docker compose up`` o una reinicio directo a través de la aplicación), docker se encargara de actualizar la base de datos con los cambios hechos.


## Comandos de prueba React-Vite
- por investigar

