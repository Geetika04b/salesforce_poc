import { LightningElement, track } from 'lwc';
import getRateHistories from '@salesforce/apex/RateConverterCtrl.getRateHistories';
import createRecord from '@salesforce/apex/RateConverterCtrl.createRecord';
export default class RateConverterCmp extends LightningElement {

    amountToConvert;
    records = [];
    showSpinner = false;

    @track
    convertedAmountData = {};

    showConvertedAmt = false;

    async connectedCallback() {
        this.records = await getRateHistories();
    }

    handleAmountChange(event) {
        this.amountToConvert = event.detail.value;
    }

    async handleConvert() {
        this.showSpinner = true;
        this.convertedAmountData = {};
        this.showConvertedAmt = false;
        await Promise.all([this.convertAmountAndCreateHistory('USD'), this.convertAmountAndCreateHistory('EUR')])
        this.records = await getRateHistories();
        this.showSpinner = false;
        this.showConvertedAmt = true;
    }

    async convertAmountAndCreateHistory(currencyToConvert) {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'apikey': "7G15Bo7ekN520m2EtQDYBRnYTXwaj6nO"
            }
        };
        try {
            const response = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${currencyToConvert}&from=CAD&amount=${this.amountToConvert}`, requestOptions);
            const result_1 = await response.text();
            const { result: convertedAmount } = JSON.parse(result_1) || {};
            this.convertedAmountData[currencyToConvert] = convertedAmount;
            return createRecord({
                fromCurrency: 'CAD',
                toCurrency: currencyToConvert,
                fromAmt: this.amountToConvert,
                toAmt: convertedAmount
            });
        } catch (error) {
            return console.log('error', error);
        }
    }
}