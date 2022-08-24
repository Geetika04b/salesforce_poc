public class RateConverterCtrl {
    
    @AuraEnabled
    public static List< RateConversionHistory__c > getRateHistories(){
        return [SELECT Id,Name,Amount_to_convert__c ,Converted_Amount__c, Converted_Currency__c, Currency_to_Convert__c  
                FROM RateConversionHistory__c ORDER BY CreatedDate DESC];
    }
    
    @AuraEnabled
    public static void createRecord(string fromCurrency,string toCurrency,Decimal fromAmt,Decimal toAmt){
        INSERT new RateConversionHistory__c(Amount_to_convert__c=fromAmt,
                                            Converted_Currency__c=fromCurrency,
                                            Currency_to_Convert__c=toCurrency,
                                            Converted_Amount__c=toAmt);
    }
}