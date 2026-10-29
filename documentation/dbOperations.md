## Identificar las operaciones de lectura-escritura en nuestra app.

| Entidad | Operaciones | Informacion necesaria | Tipo Operacion |
|---------|-------------|-----------------------|----------------|
|Producto | obtener datos| nombre,precio, stock | Lectura        |
|---------|--------------|----------------------|----------------|
|cliente  | obtener datos| detalles del cliente | Lectura        |
|---------|--------------|----------------------|----------------|
|Pedido,  |              | detalles de productos|                |
|Cliente, | obtener datos| detalles del pedido  | Lectura        |
|Productos|del pedido    | datos del cliente,   |                |
|----------|-------------|----------------------|----------------|
|Producto | crear nuevo prod| detalles del prod.| escritura      |
|---------|--------------|----------------------|----------------|
|Cliente  | crear/modificar cliente| detalles del cliente | Lectura/Escritura|
|---------|--------------|-----------------------|---------------|
|Pedidos  | confeccionar pedido| nombre del cliente,prod, stock| Escritura|



Lo primero es identificar las operaciones de lectura, por ejemplo, para saber qué tipos de datos se
traen desde la base, y cuales van a ser los más accesados.
En este caso tenemos varios de lectura, siendo el de obtener los datos del pedido, el más demandante.



## Identificar las cantidades de operaciones
Dadas las operaciones de lectura y escritura de la base, deberíamos poder
estimar las cantidades de operaciones de cada una que se darán en segundos
Las operaciones de lectura de datos estresa mucho menos la base que las
operaciones de escritura, por lo que, es recomedable tener una idea de qué
operaciones de escritura son más estresantes para poder optimizar la 
base con respecto a esas operaciones.

## Identificar relaciones


