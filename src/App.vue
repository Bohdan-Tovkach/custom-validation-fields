<template>
  <v-app>
    <v-app-bar
			app
      color="primary"
			flat
    >
			<h2 class="display-1 white--text">my-site.com</h2>
    </v-app-bar>
    <v-content>
      <Index></Index>
    </v-content>
  </v-app>
</template>
<script>
import Index from './components/Index.vue'

export default {
	name: 'App',
	components: {
		Index,
	},
  data: () => ({
		drawerState: true,
  }),
};
</script>
