<template>
  <div class="faq-section">
    <div class="section-header">
      <v-icon color="primary" size="28" class="mr-3">mdi-frequently-asked-questions</v-icon>
      <h2 class="section-title">Preguntas frecuentes</h2>
    </div>

    <v-expansion-panels variant="accordion" class="faq-panels">
      <!-- Comisiones de MercadoPago -->
      <v-expansion-panel class="faq-panel">
        <v-expansion-panel-title class="faq-title">
          <div class="d-flex align-center">
            <v-icon color="primary" size="20" class="mr-3">mdi-calculator-variant</v-icon>
            <span>¿Cuáles son las comisiones de Mercado Pago?</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="faq-content">
          <div class="commission-info">
            <p class="mb-4">
              Mercado Pago cobra una comisión por procesar los pagos,
              que varía según el método de pago elegido por tus compradores:
            </p>

            <div class="commission-table">
              <div class="table-header">
                <div class="header-cell">Método de pago</div>
                <div class="header-cell">Comisión + IVA</div>
                <div class="header-cell">Disponibilidad</div>
              </div>

              <div class="table-row">
                <div class="cell payment-method">
                  <v-icon color="success" size="16" class="mr-2">mdi-credit-card</v-icon>
                  Todos los medios
                </div>
                <div class="cell commission">6,29% + IVA</div>
                <div class="cell availability">
                  <v-chip color="success" size="small" variant="tonal">
                    <v-icon start size="12">mdi-clock-fast</v-icon>
                    Al momento
                  </v-chip>
                </div>
              </div>

              <div class="table-row">
                <div class="cell payment-method">
                  <v-icon color="info" size="16" class="mr-2">mdi-credit-card</v-icon>
                  Todos los medios
                </div>
                <div class="cell commission">4,39% + IVA</div>
                <div class="cell availability">
                  <v-chip color="info" size="small" variant="tonal">
                    <v-icon start size="12">mdi-calendar-clock</v-icon>
                    10 días
                  </v-chip>
                </div>
              </div>

              <div class="table-row">
                <div class="cell payment-method">
                  <v-icon color="warning" size="16" class="mr-2">mdi-credit-card</v-icon>
                  Todos los medios
                </div>
                <div class="cell commission">3,39% + IVA</div>
                <div class="cell availability">
                  <v-chip color="warning" size="small" variant="tonal">
                    <v-icon start size="12">mdi-calendar</v-icon>
                    18 días
                  </v-chip>
                </div>
              </div>

              <div class="table-row">
                <div class="cell payment-method">
                  <v-icon color="primary" size="16" class="mr-2">mdi-credit-card</v-icon>
                  Todos los medios
                </div>
                <div class="cell commission">1,49% + IVA</div>
                <div class="cell availability">
                  <v-chip color="primary" size="small" variant="tonal">
                    <v-icon start size="12">mdi-calendar-month</v-icon>
                    35 días
                  </v-chip>
                </div>
              </div>
            </div>

            <div class="commission-note">
              <p class="mb-3">
                <strong>Importante:</strong> Estas comisiones son
                cobradas directamente por Mercado Pago y pueden cambiar
                según sus políticas.
              </p>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel class="faq-panel">
        <v-expansion-panel-title class="faq-title">
          <div class="d-flex align-center">
            <v-icon color="primary" size="20" class="mr-3">mdi-help-circle-outline</v-icon>
            <span>¿Por qué necesitamos vincular tu cuenta de Mercado Pago?</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="faq-content">
          <div class="faq-text">
            Para que puedas recibir los pagos de forma inmediata de las
            ventas realizadas a través de nuestra plataforma, es necesario vincular
            tu cuenta de Mercado Pago. Esta vinculación es un proceso
            <strong>100% seguro</strong> y autorizado directamente por
            Mercado Pago. <br><br>
            Al vincular tu cuenta, garantizas que los compradores puedan
            pagar con total confianza y tú recibas el dinero de manera
            automática.
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel class="faq-panel">
        <v-expansion-panel-title class="faq-title">
          <div class="d-flex align-center">
            <v-icon color="primary" size="20" class="mr-3">mdi-shield-check</v-icon>
            <span>¿Qué permisos solicita la plataforma?</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="faq-content">
          <div class="faq-text">
            Al vincular tu cuenta, Mercado Pago te informará que nuestra plataforma podrá:
            <div class="permissions-list mt-3">
              <div class="permission-item">
                <v-icon color="success" size="18" class="mr-2">mdi-eye-outline</v-icon>
                <div>
                  <strong>Ver algunos datos de tu cuenta:</strong> solo
                  accedemos a la información necesaria para procesar los
                  pagos de tus ventas (nombre, email y movimientos
                  relacionados con las transacciones).
                  <div class="highlight-text">
                    <v-icon size="16" class="mr-1">mdi-shield-lock</v-icon>
                    No tenemos acceso a datos NO relacionados con la plataforma
                  </div>
                </div>
              </div>
              <div class="permission-item">
                <v-icon color="success" size="18" class="mr-2">mdi-cash-multiple</v-icon>
                <div>
                  <strong>Crear y administrar pagos en tu nombre:</strong>
                  necesario para que recibas el dinero de las ventas
                  y, si corresponde, realizar devoluciones a
                  tus compradores.
                  <div class="highlight-text">
                    <v-icon size="16" class="mr-1">mdi-shield-lock</v-icon>
                    No podemos realizar compras en tu nombre
                  </div>
                </div>
              </div>
              <div class="permission-item">
                <v-icon color="success" size="18" class="mr-2">mdi-cog-outline</v-icon>
                <div>
                  <strong>Operar con tu cuenta:</strong> solo para
                  gestionar los cobros de tus ventas en la plataforma.
                  <div class="highlight-text">
                    <v-icon size="16" class="mr-1">mdi-shield-lock</v-icon>
                    No podemos transferir dinero fuera de las
                    operaciones de venta
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel class="faq-panel">
        <v-expansion-panel-title class="faq-title">
          <div class="d-flex align-center">
            <v-icon color="error" size="20" class="mr-3">mdi-shield-off-outline</v-icon>
            <span>¿Qué NO puede hacer la plataforma con tu cuenta?</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="faq-content">
          <div class="restrictions-list">
            <div class="restriction-item">
              <v-icon color="error" size="18" class="mr-2">mdi-close-circle</v-icon>
              <span>No podemos acceder a tu dinero ni transferir fondos a cuentas externas</span>
            </div>
            <div class="restriction-item">
              <v-icon color="error" size="18" class="mr-2">mdi-close-circle</v-icon>
              <span>No podemos ver información privada de otras operaciones
                no relacionadas con tus ventas</span>
            </div>
            <div class="restriction-item">
              <v-icon color="error" size="18" class="mr-2">mdi-close-circle</v-icon>
              <span>No podemos realizar compras, pagos personales ni
                modificar tus datos en Mercado Pago</span>
            </div>
            <div class="restriction-item">
              <v-icon color="error" size="18" class="mr-2">mdi-close-circle</v-icon>
              <span>No compartimos tu información con terceros</span>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel class="faq-panel">
        <v-expansion-panel-title class="faq-title">
          <div class="d-flex align-center">
            <v-icon color="primary" size="20" class="mr-3">mdi-alert-circle-outline</v-icon>
            <span>¿Por qué Mercado Pago muestra estos avisos?</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="faq-content">
          <div class="faq-text">
            Mercado Pago informa sobre todos los permisos posibles que
            una aplicación puede solicitar, pero
            <strong>nuestra plataforma solo utiliza los estrictamente necesarios</strong>
            para gestionar la venta de productos y la acreditación de tus
            cobros. <br><br>
            Es una medida de transparencia y seguridad que aplica
            Mercado Pago con todas las aplicaciones integradas.
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel class="faq-panel">
        <v-expansion-panel-title class="faq-title">
          <div class="d-flex align-center">
            <v-icon color="primary" size="20" class="mr-3">mdi-link-off</v-icon>
            <span>¿Puedo revocar la vinculación?</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="faq-content">
          <div class="faq-text">
            <strong>¡Por supuesto!</strong> Puedes desvincular tu cuenta
            en cualquier momento:
            <div class="revoke-options mt-3">
              <div class="revoke-option">
                <v-icon color="primary" size="18" class="mr-2">mdi-application-cog</v-icon>
                <span>Desde esta página usando el botón "Desvincular"</span>
              </div>
              <div class="revoke-option">
                <v-icon color="primary" size="18" class="mr-2">mdi-shield-account</v-icon>
                <span>Desde tu cuenta de Mercado Pago, en "Herramientas de Seguridad"</span>
              </div>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel class="faq-panel">
        <v-expansion-panel-title class="faq-title">
          <div class="d-flex align-center">
            <v-icon color="primary" size="20" class="mr-3">mdi-chat-question</v-icon>
            <span>¿Tienes más dudas?</span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="faq-content">
          <div class="contact-section">
            <p class="mb-4">
              Nuestro equipo está aquí para ayudarte. Contáctanos por tu medio preferido:
            </p>
            <div class="contact-options">
              <v-btn
                color="primary"
                variant="outlined"
                href="mailto:soporte@partners.com"
                class="contact-btn mb-3"
                block
              >
                <v-icon start>mdi-email</v-icon>
                <span class="contact-text">soporte@partners.com</span>
              </v-btn>
              <v-btn
                color="success"
                variant="outlined"
                href="https://wa.me/5491112345678"
                target="_blank"
                class="contact-btn mb-3"
                block
              >
                <v-icon start>mdi-whatsapp</v-icon>
                <span class="contact-text">+54 9 11 1234-5678</span>
              </v-btn>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<style scoped>
/* FAQ Section */
.faq-section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
}

.faq-panels {
  border-radius: 12px;
  overflow: hidden;
}

.faq-panel {
  background: white;
  margin-bottom: 0.75rem;
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.faq-title {
  font-size: 1.05rem;
  font-weight: 600;
  padding: 1.25rem 1.5rem;
}

.faq-content {
  padding: 1.5rem;
  background: #fafbfc;
}

.faq-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #5f6368;
}

/* Commission Table */
.commission-info {
  font-size: 1rem;
  color: #5f6368;
}

.commission-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  font-weight: 600;
  padding: 1rem;
}

.header-cell {
  padding: 0.5rem;
  font-size: 0.95rem;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s ease;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f5f7fa;
}

.cell {
  padding: 0.5rem;
  display: flex;
  align-items: center;
}

.payment-method {
  font-weight: 500;
  color: #1a1a1a;
}

.commission {
  font-weight: 600;
  color: #1976d2;
}

.commission-note {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
}

.commission-note p {
  margin: 0;
  color: #5f6368;
  line-height: 1.6;
}

/* Permissions & Restrictions */
.permissions-list,
.restrictions-list {
  margin-top: 1rem;
}

.permission-item,
.restriction-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.permission-item strong,
.restriction-item span {
  color: #1a1a1a;
  line-height: 1.6;
}

.highlight-text {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #e8f5e9;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #2e7d32;
  font-weight: 500;
}

/* Revoke Options */
.revoke-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.revoke-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* Contact Section */
.contact-section {
  padding: 1rem 0;
}

.contact-options {
  max-width: 400px;
  margin: 0 auto;
}

.contact-btn {
  justify-content: flex-start;
  text-transform: none;
  font-size: 1rem;
}

.contact-text {
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 960px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .header-cell,
  .cell {
    padding: 0.25rem;
  }

  .availability {
    justify-content: flex-start;
  }
}
</style>
