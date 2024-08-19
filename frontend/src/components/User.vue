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
                    <p>Balance: <strong>{{ balanceFormatted }} ETH</strong></p>
                    <p>Stake balance: <strong>{{ stakeBalanceFormatted }} tokens</strong></p>
                </v-col>
            </v-row>
            <v-list lines="two" v-if="false">
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
import {ref, onMounted, watch} from "vue";
import { ethers } from 'ethers';
import { VNumberInput } from 'vuetify/labs/VNumberInput'

const props = defineProps(["name", "signer", "getSignerBalance", "avatar", "stake", "withdrawing", "getSignerAddress", "getSignerStakingBalance"]);

const inputAttrs = {
    type: "number",
    outlined: true,
    required: true,
    min: 1,
    controlVariant: "split"
}

const stakeAmount = ref(0);
const withdrawingAmount = ref(0);
const balance = ref(null);
const balanceFormatted = ref(0);
const stakeBalance = ref(0);
const stakeBalanceFormatted = ref(0);
const address = ref(null);

const checkAddress = async () => {
    try {
        if (!address.value) address.value = await props.getSignerAddress(props.signer);
    } catch (error) {
        console.error('Failed to fetch signer address:', error);
    }
}

const getBalance = async () => {
    await checkAddress();
    try {
        balance.value = await props.getSignerBalance(address.value);
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}

const getStakingBalance = async () => {
    await checkAddress();
    try {
        stakeBalance.value = await props.getSignerStakingBalance(address.value);
    } catch (error) {
        console.error("Error fetching staking balance:", error);
    }
}

const handleStakeSubmit = async () => {
    await checkAddress();
    try {
        await props.stake(stakeAmount.value, props.signer, address.value);
        console.log('success');
        await getBalance();
        console.log('new Baln', balance.value)
    } catch(error) {
        console.error('Error staking:', error)
    }
}

const handleWithdrawingSubmit = async () => {
    await checkAddress();
    try {
        await props.withdrawing(stakeAmount.value, address.value);
        console.log('success');
        await getBalance();
        console.log('new Baln', balance.value)
    } catch(error) {
        console.error('Error withdrawing:', error)
    }
}

watch(balance, (value) => {
    balanceFormatted.value = value ? ethers.utils.formatEther(value) : 0
}, {immediate: true});

watch(stakeBalance, (value) => {
    stakeBalanceFormatted.value = value ? ethers.utils.formatEther(value) : 0
}, {immediate: true});

onMounted(async () => {
    await getBalance();
    await getStakingBalance();
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