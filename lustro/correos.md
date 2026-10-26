<script setup>
import { ref, computed } from 'vue'
const sampleName = ref('Alex')
const examples = [
  { id:'bienvenida', title:'Bienvenida', kind:'Cuenta', subject:'Tu espacio ya está listo', preheader:'Descubre lo que puedes hacer con tu cuenta.', heading:'Bienvenido, {name}', body:'Tu cuenta está lista. Explora el catálogo y elige lo que quieres hacer primero.', detail:'Si no creaste una cuenta, puedes ignorar este correo y contactar a soporte.', action:'Explorar la plataforma' },
  { id:'verificar-correo', title:'Verificar correo', kind:'Cuenta', subject:'Confirma tu dirección de correo', preheader:'Un paso más para activar tu cuenta.', heading:'Confirma tu correo, {name}', body:'Para terminar de crear tu cuenta, confirma que esta dirección te pertenece.', detail:'El enlace de verificación caduca pronto. Si no pediste esta cuenta, ignora este mensaje.', action:'Confirmar correo' },
  { id:'recuperar-contrasena', title:'Recuperar contraseña', kind:'Seguridad', subject:'Restablece tu contraseña', preheader:'Recibimos una solicitud para recuperar el acceso.', heading:'Recupera el acceso', body:'Alguien pidió restablecer la contraseña de tu cuenta. Si fuiste tú, usa el enlace seguro.', detail:'El enlace tiene vencimiento. Si no lo pediste, no hagas nada; tu contraseña no cambiará.', action:'Restablecer contraseña' },
  { id:'reserva-confirmada', title:'Reserva confirmada', kind:'Reservas', subject:'Tu reserva está confirmada', preheader:'Todo listo para tu próxima clase.', heading:'Nos vemos en clase, {name}', body:'Tu lugar está confirmado para la clase de prueba del jueves a las 18:00.', detail:'Antes de enviar en producción, incluye fecha, hora, zona horaria, sede, política de cambios y un enlace real para gestionar la reserva.', action:'Ver mi reserva' },
  { id:'recordatorio-de-clase', title:'Recordatorio de clase', kind:'Reservas', subject:'Tu clase es mañana', preheader:'Prepara todo para llegar a tiempo.', heading:'Mañana nos vemos, {name}', body:'Te esperamos en tu clase de prueba a las 18:00. Llega con unos minutos de anticipación.', detail:'Incluye hora local, dirección verificada y condiciones de cancelación solo cuando estén conectadas a datos reales.', action:'Ver detalles' },
  { id:'cupo-en-lista-de-espera', title:'Cupo en lista de espera', kind:'Reservas', subject:'Se liberó un cupo', preheader:'Confirma dentro del plazo indicado.', heading:'Hay un lugar para ti', body:'Se liberó un cupo en la clase que estabas esperando.', detail:'Si el cupo vence, muestra un límite concreto calculado desde el sistema. Nunca prometas un lugar sin confirmación real.', action:'Confirmar cupo' },
  { id:'clase-cancelada', title:'Clase cancelada', kind:'Reservas', subject:'Cambio en tu clase', preheader:'Tu clase de prueba fue cancelada.', heading:'La clase cambió, {name}', body:'La clase de prueba ya no estará disponible. Revisa tus alternativas antes de volver a reservar.', detail:'Explica el impacto exacto sobre créditos, reembolso y reservas según la política vigente; no uses este texto genérico para notificar una cancelación real.', action:'Ver alternativas' },
  { id:'comprobante-de-compra', title:'Comprobante de compra', kind:'Compras', subject:'Comprobante de tu compra', preheader:'Consulta el detalle de tu pedido.', heading:'Compra registrada', body:'Gracias por tu compra. El detalle de esta demostración es solo ilustrativo.', detail:'En producción incluye comercio, fecha, ID, ítems, moneda, impuestos, total y enlace al comprobante verificado. Nunca uses números de ejemplo como factura.', action:'Ver comprobante' },
  { id:'membresia-por-vencer', title:'Membresía por vencer', kind:'Membresías', subject:'Tu membresía vence pronto', preheader:'Revisa la fecha y tus opciones.', heading:'Revisa tu membresía', body:'Tu plan de demostración está próximo a vencer. Comprueba tus opciones antes de tomar una decisión.', detail:'Muestra fecha exacta, renovación automática o manual, precio y condiciones reales cuando estén disponibles.', action:'Ver mi plan' }
]
const name = computed(() => sampleName.value.trim() || 'Alex')
</script>

# Correos transaccionales

Nueve vistas de ejemplo para los eventos de cuenta, reservas y membresía del catálogo de [PulseFit](https://pulsefit-sketch.vercel.app/#emails), adaptadas a Lustro. **No envían correos** y no incluyen datos de clientes. Cada vista enseña asunto, preheader, mensaje, acción y detalles que deben venir de datos reales antes de usarse en producción.

<div class="l-demo l-form"><label class="l-field-label" for="email-name">Personalizar ejemplos: nombre ficticio</label><input id="email-name" v-model="sampleName" maxlength="32" autocomplete="off" placeholder="Alex"><small>Esta vista no guarda ni envía el nombre.</small></div>

<template v-for="mail in examples" :key="mail.id">
<h2 :id="mail.id">{{mail.title}}</h2>
<p>{{mail.kind}} · Vista previa. Ajusta contenido y enlaces al evento real antes de enviar.</p>
<div class="l-mail-meta"><div><strong>Asunto</strong><span>{{mail.subject}}</span></div><div><strong>Preheader</strong><span>{{mail.preheader}}</span></div></div>
<div class="l-mail-preview"><div class="l-mail-brand">LUSTRO <span>✦</span></div><div class="l-mail-body"><span class="l-eyebrow">{{mail.kind.toUpperCase()}} · EJEMPLO</span><h3>{{mail.heading.replace('{name}',name)}}</h3><p>{{mail.body}}</p><a class="l-btn l-primary" href="#correos-transaccionales" :aria-label="mail.action + ' (enlace de demostración)'">{{mail.action}}</a><p class="l-mail-detail">{{mail.detail}}</p></div><footer>Vista de demostración · Sin datos reales · <a href="#correos-transaccionales">Volver al inicio</a></footer></div>
</template>

## Antes de enviar

Usa una plantilla HTML de correo con estilos inline y texto alternativo, no copies el CSS de esta página. Verifica datos, política, destinatario, enlaces absolutos y remitente; evita poner secretos, contraseñas o códigos de un solo uso en URLs de ejemplo. Envía una prueba a dispositivos y clientes de correo, y revisa la versión sin imágenes. La acción de cada vista aquí **solo vuelve al inicio de la guía**.
