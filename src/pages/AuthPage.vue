<script>
import AppLayout from "@/layouts/AppLayout.vue";
export default {
  name: "AuthPage",
  components: { AppLayout },
  data() {
    return {
      valid: false,
      show: false,
      form: {
        login: 'qwer',
        password: '',
      },
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
      },
    }
  }
}
</script>

<template>
  <AppLayout>
    <v-form
      v-model="valid"
      class="d-flex align-center justify-center fill-height darken-4 w-100"
    >
      <v-card width="400">
        <template v-slot:title>
          Login
        </template>

        <template v-slot:text>
          <v-row>
            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="form.login"
                :counter="10"
                label="Login"
                hide-details
                required
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="12"
            >
              <v-text-field
                v-model="form.password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show ? 'text' : 'password'"
                hint="At least 8 characters"
                label="Password"
                counter
                @click:append="show = !show"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
      </v-card>
    </v-form>
  </AppLayout>
</template>

<style scoped>

</style>
