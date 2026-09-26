# Instrucciones de instalacion y ejecucion

-----
#### !IMPORTANTE!: DEBES TENER DOCKER DESKTOP ABIERTO PARA QUE LOS COMANDOS FUNCIONEN
-----

La primera vez que se ejecute este comando, se encargara de construir, compilar y builder todos los archivos necesarios para ejecutar tanto la base de datos, la api y la pagina web.
´´´sh
docker compose up
´´´

Antes de finalizar el trabajo asegurate de ejecutar el comando, para finalizar los proces de forma segura

´´´sh
docker compose down
´´´

# Instrucciones de prueba

## ¿Cómo supervisar y gestionar la base de datos postgres con dbeaver?

El proceso no es tan diferente como se conectaba uno en los laboratorios de Taller de Base de datos. Debes buscar el archivo ".env" en la carpeta principal del proyecto.

Ahí encontraras los valores de los campos POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, DB_HOST, DB_PORT necesarios para ingresarlo en la configuración de conexión de Dbeaver, en caso de mas preguntas consultar a Emilio o Enri.

## Comandos de prueba DJango

## Comandos de prueba React-Vite
- por investigar

