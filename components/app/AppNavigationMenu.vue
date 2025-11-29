<template>
  <div>
    <!-- Versión de escritorio -->
    <v-sheet class="navigation-menu pa-0 d-none d-sm-block" elevation="1">
      <v-container class="pa-0">
        <v-row no-gutters align="center" justify="start" class="pa-0">
          <v-col v-for="(item, index) in menuItems" :key="index" cols="auto" class="pa-0">
            <v-btn
              :to="item.route"
              variant="text"
              class="navigation-item px-4"
              rounded="0"
              height="56"
              :color="item.color || ''"
            >
              <v-icon v-if="item.icon" :icon="item.icon" class="mr-1" size="small"/>
              {{ item.title }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <!-- Versión móvil -->
    <v-sheet class="d-sm-none pa-0" elevation="1">
      <v-container class="pa-0">
        <v-row no-gutters>
          <v-col cols="12">
            <v-menu
              v-model="isMenuOpen"
              :close-on-content-click="false"
              location="bottom"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  block
                  variant="text"
                  class="mobile-menu-toggle text-left"
                  height="56"
                >
                  <v-icon icon="mdi-menu" class="mr-2" />
                  Menú de navegación
                  <v-spacer/>
                  <v-icon :icon="isMenuOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in menuItems"
                  :key="index"
                  :to="item.route"
                  :value="item.title"
                >
                  <template #prepend>
                    <v-icon v-if="item.icon" :icon="item.icon" :color="item.color || undefined" />
                  </template>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface MenuItem {
  title: string;
  route: string;
  icon?: string;
  color?: string;
}

const isMenuOpen = ref(false);

const menuItems: MenuItem[] = [
  { title: 'Inicio', route: '/', icon: 'mdi-home' },
  { title: 'Productos', route: '/products', icon: 'mdi-view-grid' },
];
</script>

<style scoped>
.navigation-menu {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.navigation-item {
  font-size: 14px;
  text-transform: none;
  letter-spacing: normal;
}

.navigation-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.mobile-menu-toggle {
  text-transform: none;
  letter-spacing: normal;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style> 