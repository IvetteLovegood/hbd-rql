# Para Raquel ♡

Una carta de cumpleaños en forma de pequeño libro. Sitio estático, sin instalación de dependencias, con diseño adaptable, animación de páginas y sonido generado en el navegador. El audio comienza solo después de interactuar y se puede desactivar.

## Ver en local

Desde este repositorio:

```sh
python3 -m http.server 3000 --bind 0.0.0.0 --directory site
```

Abre el puerto 3000 en tu navegador de desarrollo. No hace falta ejecutar un build.

## Personalizar

Edita `letters` al principio de `site/script.js` para cambiar la carta y la firma. El texto actual es de ejemplo. Los colores y la tipografía están en `site/style.css`.

## Publicar en Netlify

Puedes arrastrar la carpeta **site** al área de despliegue manual de Netlify. Para despliegue continuo, sube el repositorio a GitHub y en Netlify selecciona **Add new project → Import an existing project**, conecta este repositorio y elige la rama que contenga los archivos. Deja vacío el comando de build y usa `site` como directorio de publicación; `netlify.toml` ya contiene esa configuración.

Las fuentes de Google son opcionales: sin conexión se usan las fuentes locales de respaldo. No se necesitan claves, servicios externos de pago ni variables de entorno.
