<template>
    <v-card class="mx-auto" max-width="700">
        <v-card-text>
            <h1>Create a new Event!</h1>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                    v-model="name"
                    :rules="nameRules"
                    label="Event name"
                    required
                ></v-text-field>

                <v-row justify="space-around"
                    ><v-date-picker
                        no-title
                        v-model="dates"
                        range
                    ></v-date-picker>
                    <v-color-picker hide-inputs class="ma-2"></v-color-picker
                ></v-row>
                <br />
                <v-text-field
                    v-model="dateRangeText"
                    label="Date range"
                    readonly
                ></v-text-field>
                <br />
                <v-row justify="center"
                    ><v-btn
                        :disabled="!valid"
                        color="success"
                        class="mr-4"
                        @click="submit"
                    >
                        Save
                    </v-btn>

                    <v-btn color="error" class="mr-4" @click="reset">
                        Reset Form
                    </v-btn>
                </v-row>
            </v-form>
        </v-card-text>
        <v-card-actions class="text-center">
            <v-btn to="/" color="primary">Back Home</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        dates: [null, null],
        valid: true,
        name: null,
        nameRules: [v => !!v || "Name is required"]
    }),
    computed: {
        dateRangeText() {
            return this.dates.join(" ~ ");
        }
    },
    mounted() {
        this.$refs.form.reset();
    },
    methods: {
        reset() {
            this.$refs.form.reset();
        }
    }
};
</script>
