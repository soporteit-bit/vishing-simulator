# 🛡️ Simulador de Vishing - Formación en Ciberseguridad

Simulador interactivo para entrenar a usuarios en la identificación y prevención de ataques de vishing (voice phishing).

## 🚀 Despliegue Rápido (Opción Recomendada: Vercel)

### Requisitos Previos
- Cuenta en [Vercel](https://vercel.com) (gratis)
- Cuenta en [GitHub](https://github.com) (gratis)

### Pasos:

#### 1. Preparar Archivos

Asegúrate de tener esta estructura de carpetas:

```
vishing-simulator/
├── .gitignore
├── index.html
├── main.jsx
├── package.json
├── vercel.json
├── vite.config.js
└── VishingSimulator.jsx  ← El archivo del simulador
```

#### 2. Inicializar Git y Subir a GitHub

```bash
# En la carpeta del proyecto:
git init
git add .
git commit -m "Initial commit - Vishing Simulator"

# Crear repositorio en GitHub primero, luego:
git remote add origin https://github.com/TU-USUARIO/vishing-simulator.git
git branch -M main
git push -u origin main
```

#### 3. Conectar con Vercel

**Opción A: Desde la Web (Más Fácil)**
1. Ve a [vercel.com/new](https://vercel.com/new)
2. Conecta tu cuenta de GitHub
3. Selecciona el repositorio `vishing-simulator`
4. Click en "Deploy"
5. ¡Espera 1 minuto y listo!

**Opción B: Desde CLI**
```bash
# Instalar Vercel CLI
npm install -g vercel

# En la carpeta del proyecto:
vercel

# Sigue las instrucciones en pantalla
```

#### 4. Tu URL
Tu simulador estará disponible en:
```
https://vishing-simulator.vercel.app
```

Puedes personalizar el dominio en Vercel Settings.

---

## 💻 Desarrollo Local

### Instalación

```bash
# Clonar o descargar los archivos
cd vishing-simulator

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El simulador estará disponible en: `http://localhost:3000`

### Comandos Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Vista previa de producción
```

---

## 📱 Características

- ✅ 5 escenarios diferentes de vishing
- ✅ Sin alertas durante el juego (experiencia realista)
- ✅ Sistema de puntuación
- ✅ Análisis detallado de red flags al final
- ✅ Responsive (funciona en móvil y tablet)
- ✅ Sin necesidad de registro
- ✅ Totalmente gratuito

---

## 🎯 Escenarios Incluidos

1. **Banco** - Fraude detectado
2. **Soporte Técnico** - Microsoft
3. **Agencia Tributaria** - Deuda pendiente
4. **Familiar en Apuros** - Emergencia
5. **Paquetería** - Problema con envío

---

## 🔧 Personalización

### Cambiar Colores

Edita los colores en `VishingSimulator.jsx`:

```javascript
// Busca las clases de Tailwind y cámbielas:
className="bg-blue-600"  // Azul
className="bg-red-600"   // Rojo
className="bg-green-600" // Verde
```

### Añadir Nuevo Escenario

1. Abre `VishingSimulator.jsx`
2. Busca el objeto `scenarios`
3. Añade tu nuevo escenario siguiendo la estructura existente

Ejemplo:
```javascript
mi_escenario_intro: {
  title: "📞 Título",
  description: "Descripción...",
  question: "¿Qué haces?",
  options: [
    {
      text: "Opción 1",
      next: "mi_escenario_paso2",
      points: 10,
      feedback: "Feedback...",
      trackFlag: "Red flag a registrar"
    }
  ]
}
```

---

## 📊 Otros Métodos de Despliegue

### GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Modificar package.json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

# Modificar vite.config.js
export default defineConfig({
  base: '/vishing-simulator/',
  // ... resto de configuración
})

# Deploy
npm run deploy
```

URL: `https://TU-USUARIO.github.io/vishing-simulator`

### Netlify

**Drag & Drop:**
1. `npm run build`
2. Ve a [app.netlify.com/drop](https://app.netlify.com/drop)
3. Arrastra la carpeta `dist/`
4. ¡Listo!

### Servidor Propio (Docker)

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t vishing-simulator .
docker run -d -p 80:80 vishing-simulator
```

---

## 🎓 Uso en Formación

### Compartir con Usuarios

**Email Ejemplo:**
```
Asunto: Formación Ciberseguridad - Simulador Interactivo

Hola equipo,

Hemos preparado un simulador de vishing para entrenar 
en identificación de ataques telefónicos.

🔗 Link: https://tu-url.vercel.app
⏱️ Duración: 15-20 minutos
📱 Funciona en cualquier dispositivo

Instrucciones:
1. Abre el link
2. Elige un escenario
3. Toma decisiones como lo harías en la vida real
4. Revisa tu puntuación y aprende

Saludos
```

### Dinámicas de Grupo

- **Individual:** Cada persona hace 1-2 escenarios
- **Grupal:** Proyectar y decidir en equipo
- **Competencia:** Ranking de puntuaciones
- **Role-play:** Actuar los escenarios

---

## 🔒 Seguridad y Privacidad

- ✅ No recopila datos personales
- ✅ No requiere registro
- ✅ Sin cookies de tracking
- ✅ Código open source auditable
- ✅ HTTPS automático (Vercel/Netlify)

---

## 📞 Soporte

### Problemas Comunes

**"Pantalla blanca"**
- Verifica que todos los archivos estén subidos
- Revisa la consola del navegador (F12)
- Asegúrate de que `VishingSimulator.jsx` está en la carpeta

**"Iconos no aparecen"**
- Verifica que `lucide-react` esté en package.json
- Ejecuta `npm install` de nuevo

**"Build falla"**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📝 Licencia

MIT License - Libre para uso educativo y corporativo

---

## 🌟 Contribuir

¿Tienes ideas para nuevos escenarios o mejoras?

1. Fork el repositorio
2. Crea una rama: `git checkout -b nueva-funcionalidad`
3. Commit: `git commit -m 'Añadir nueva funcionalidad'`
4. Push: `git push origin nueva-funcionalidad`
5. Crea un Pull Request

---

## 📚 Documentación Adicional

- [Guía Completa de Deployment](./guia-deployment-completa.md)
- [Escenarios Adicionales](./escenarios-adicionales-vishing.md)
- [Guía de Implementación](./guia-implementacion-vishing.md)

---

## 👏 Créditos

Desarrollado para formación en ciberseguridad.

---

## 🔗 Links Útiles

- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de React](https://react.dev/)
- [Documentación de Vercel](https://vercel.com/docs)
- [Lucide Icons](https://lucide.dev/)

---

**¿Preguntas?** Abre un issue en GitHub o contacta al equipo de formación.

**⚠️ Disclaimer:** Este es un simulador educativo. Los escenarios son ficticios y creados con fines formativos.
