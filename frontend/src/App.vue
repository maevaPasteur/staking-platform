<template>
    <v-app>
        <v-app-bar app>
            <v-toolbar-title>Staking platform</v-toolbar-title>
        </v-app-bar>
        <v-main v-if="isInitialized">
            <v-container>
                <v-row>
                    <v-col cols="6">
                        <h2 class="mb-3">Users</h2>
                        <User
                                v-for="(user, i) in [{name: 'Tom', signer: tom}, {name: 'Julia', signer: julia}]"
                                :name="user.name"
                                :signer="user.signer"
                                :avatar="`https://avatars0.githubusercontent.com/u/${i+1}?v=4&s=460`"
                                :stake="stake"
                                :withdrawing="withdrawing"
                                :getSignerAddress="getSignerAddress"
                                :getSignerEthersBalance="getSignerEthersBalance"
                                :getSignerStakingBalance="getSignerStakingBalance"
                                :getSignerTokenBalance="getSignerTokenBalance"
                                :transferERC20Tokens="transferERC20Tokens"
                        />
                    </v-col>

                    <v-col cols="6">
                        <h2 class="mb-3">Staking</h2>
                        <v-card v-if="totalStakedBalance" title="Balance" :text="`${formatToken(totalStakedBalance)} token`"/>
                        <br>
                        <v-card title="APY" :text="`Current value : ${apy}%`">
                            <v-card-item>
                                <v-form @submit.prevent="setAPY(newAPY)">
                                    <v-number-input
                                            v-model="newAPY"
                                            type="number"
                                            outlined
                                            required
                                            :min="1"
                                            :max="100"
                                            control-variant="split"
                                    />
                                    <v-btn color="primary" type="submit">Set APY</v-btn>
                                </v-form>
                            </v-card-item>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>


<script setup>
import { ref, watch } from 'vue';
import User from './components/User.vue';
import { useStakingContract } from './composables/useStakingContract.js';
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { useFormatToken } from './composables/useFormatToken.js';

const {
    julia,
    tom,
    isInitialized,
    apy,
    totalStakedBalance,
    getSignerEthersBalance,
    setAPY,
    stake,
    withdrawing,
    getSignerAddress,
    getSignerStakingBalance,
    getSignerTokenBalance,
    transferERC20Tokens,
} = useStakingContract();

const { formatToken } = useFormatToken();

const newAPY = ref();

watch(apy, (value) => {
    newAPY.value = Number(value);
}, {immediate: true});
</script>
