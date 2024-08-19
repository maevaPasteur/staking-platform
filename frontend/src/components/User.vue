<template>
    <v-card class="mt-4 user">
        <v-card-item>
            <v-row align="center" class="spacer mb-2" no-gutters>
                <v-col cols="4" md="1" sm="2">
                    <v-avatar size="36px">
                        <v-img alt="Avatar" :src="avatar"/>
                    </v-avatar>
                </v-col>
                <v-col class="hidden-xs-only text-left ms-2" md="3" sm="5">
                    <h3>{{ name }}</h3>
                </v-col>
                <v-col class="text-no-wrap text-left" cols="5" sm="3">
                    <p>Balance: <strong>{{ formatBalance(ethersBalance) }} ETH</strong></p>
                    <p>Token balance: <strong>{{ formatBalance(tokenBalance) }} tokens</strong></p>
                    <p>Stake balance: <strong>{{ formatBalance(stakeBalance) }} tokens</strong></p>
                </v-col>
            </v-row>
            <v-list lines="two">
                <v-alert v-if="errorMessage?.length" class="mt-2" type="error" closable @input="errorMessage = null">
                    {{ errorMessage }}
                </v-alert>
                <v-list-item>
                    <h4>Get Tokens</h4>
                    <v-form @submit.prevent="handleTokenSubmit" class="user__form">
                        <v-number-input v-model="tokenAmount" v-bind="inputAttrs"/>
                        <v-btn color="primary" variant="tonal" type="submit">Get {{ tokenAmount }} tokens</v-btn>
                    </v-form>
                </v-list-item>
                <v-list-item>
                    <h4>Stake</h4>
                    <v-form @submit.prevent="handleStakeSubmit" class="user__form">
                        <v-number-input v-model="stakeAmount" v-bind="inputAttrs"/>
                        <v-btn color="primary" variant="tonal" type="submit">Stake {{ stakeAmount }} ETH</v-btn>
                    </v-form>
                </v-list-item>
                <v-list-item>
                    <h4>Withdrawing</h4>
                    <v-form @submit.prevent="handleWithdrawingSubmit" class="user__form">
                        <v-number-input v-model="withdrawingAmount" v-bind="inputAttrs"/>
                        <v-btn color="secondary" variant="tonal" type="submit">Withdrawing {{ withdrawingAmount }} ETH</v-btn>
                    </v-form>
                </v-list-item>
            </v-list>
        </v-card-item>
    </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ethers } from 'ethers';
import { VNumberInput } from 'vuetify/labs/VNumberInput'

const props = defineProps(["name", "signer", "getSignerEthersBalance", "avatar", "stake", "withdrawing", "getSignerAddress", "getSignerStakingBalance", "getSignerTokenBalance", "transferERC20Tokens"]);

const inputAttrs = {
    type: "number",
    outlined: true,
    required: true,
    min: 1,
    controlVariant: "split"
}

const stakeAmount = ref(0);
const withdrawingAmount = ref(0);
const tokenAmount = ref(0);
const ethersBalance = ref(null);
const stakeBalance = ref(0);
const tokenBalance = ref(0);
const address = ref(null);
const errorMessage = ref(null);

const checkAddress = async () => {
    if (!address.value) address.value = await props.getSignerAddress(props.signer);
}

const getEthersBalance = async () => {
    ethersBalance.value = await props.getSignerEthersBalance(address.value);
}

const getStakingBalance = async () => {
    stakeBalance.value = await props.getSignerStakingBalance(address.value);
}

const getTokenBalance = async () => {
    tokenBalance.value = await props.getSignerTokenBalance(address.value)
}

const handleTokenSubmit = async () => {
    try {
        await props.transferERC20Tokens(tokenAmount.value, props.signer, address.value);
        await getTokenBalance();
    } catch(error) {
        errorMessage.value = error;
    }
}

const handleStakeSubmit = async () => {
    try {
        await props.stake(stakeAmount.value, props.signer);
        await getTokenBalance();
        await getStakingBalance();
    } catch(error) {
        errorMessage.value = error;
    }
}

const handleWithdrawingSubmit = async () => {
    try {
        await props.withdrawing(withdrawingAmount.value, props.signer);
        await getTokenBalance();
        await getStakingBalance();
    } catch(error) {
        errorMessage.value = error;
    }
}

const formatBalance = value => {
    return value ? parseFloat(ethers.utils.formatEther(value)).toFixed(2) : '0.00';
}

onMounted(async () => {
    await checkAddress();
    await getEthersBalance();
    await getStakingBalance();
    await getTokenBalance();
});
</script>

<style>
.user__form {
    display: flex;
    gap: 10px;
}

.user .v-number-input__control {
    display: none;
}

.user .v-field__input {
    min-height: var(--v-btn-height);
    padding: 0 10px;
}

.user {
    --v-btn-height: 38px;
}

.user .v-input__details {
    display: none;
}
</style>