<template>
  <div class="login-button-group">
    <v-btn
      variant="outlined"
      color="secondary"
      size="small"
      prepend-icon="mdi-login"
      :to="{ name: 'Login' }"
      class="mr-2 d-none d-sm-flex"
    >
      登入
    </v-btn>
    
    <v-btn
      color="primary"
      size="small"
      prepend-icon="mdi-account-plus"
      :to="{ name: 'Register' }"
      class="d-none d-sm-flex"
    >
      註冊
    </v-btn>

    <v-btn
      icon
      color="secondary"
      :to="{ name: 'Login' }"
      class="d-sm-none"
    >
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'LoginButton'
}
</script>

<style scoped>
.login-button-group {
  display: flex;
  align-items: center;
}

.v-btn {
  text-transform: none;
}
</style>