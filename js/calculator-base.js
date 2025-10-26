// Nikonomics Calculator Base Functions
// Shared functionality for all interactive calculators

class NikonomicsCalculator {
    constructor() {
        this.results = {};
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupNumberFormatting();
        this.setupResultsDisplay();
    }

    // Form validation utilities
    setupFormValidation() {
        const numberInputs = document.querySelectorAll('input[type="number"]');
        
        numberInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateNumberInput(e.target);
            });
            
            input.addEventListener('blur', (e) => {
                this.formatNumberInput(e.target);
            });
        });
    }

    validateNumberInput(input) {
        const value = parseFloat(input.value);
        
        if (input.value && (isNaN(value) || value < 0)) {
            input.style.borderColor = '#FF6B6B';
            input.setCustomValidity('Please enter a valid positive number');
        } else {
            input.style.borderColor = '#E5E7EB';
            input.setCustomValidity('');
        }
    }

    formatNumberInput(input) {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            input.value = value.toFixed(2);
        }
    }

    // Number formatting utilities
    setupNumberFormatting() {
        this.formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        };

        this.formatNumber = (number, decimals = 2) => {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(number);
        };

        this.formatPercentage = (number, decimals = 1) => {
            return new Intl.NumberFormat('en-US', {
                style: 'percent',
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(number / 100);
        };
    }

    // Results display utilities
    setupResultsDisplay() {
        this.showResults = (results) => {
            const resultsSection = document.getElementById('results');
            if (resultsSection) {
                resultsSection.classList.add('show');
                this.animateResults();
            }
        };

        this.hideResults = () => {
            const resultsSection = document.getElementById('results');
            if (resultsSection) {
                resultsSection.classList.remove('show');
            }
        };

        this.updateResult = (elementId, value, format = 'currency') => {
            const element = document.getElementById(elementId);
            if (element) {
                let formattedValue;
                switch (format) {
                    case 'currency':
                        formattedValue = this.formatCurrency(value);
                        break;
                    case 'percentage':
                        formattedValue = this.formatPercentage(value);
                        break;
                    case 'number':
                        formattedValue = this.formatNumber(value);
                        break;
                    default:
                        formattedValue = value;
                }
                element.textContent = formattedValue;
            }
        };
    }

    // Animation utilities
    animateResults() {
        const resultElements = document.querySelectorAll('.result-value');
        
        resultElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Common calculation utilities
    calculatePercentage(value, percentage) {
        return (value * percentage) / 100;
    }

    calculateCompoundGrowth(principal, rate, time) {
        return principal * Math.pow(1 + (rate / 100), time);
    }

    calculateROI(investment, returns) {
        return ((returns - investment) / investment) * 100;
    }

    calculateMonthlyPayment(principal, rate, months) {
        const monthlyRate = rate / 100 / 12;
        return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
               (Math.pow(1 + monthlyRate, months) - 1);
    }

    // Data export utilities
    exportResults(format = 'json') {
        const results = this.results;
        
        switch (format) {
            case 'json':
                this.downloadJSON(results);
                break;
            case 'csv':
                this.downloadCSV(results);
                break;
            case 'print':
                this.printResults();
                break;
        }
    }

    downloadJSON(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calculator-results.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    downloadCSV(data) {
        const headers = Object.keys(data);
        const values = Object.values(data);
        const csvContent = headers.join(',') + '\n' + values.join(',');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calculator-results.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    printResults() {
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Calculator Results</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            .result-item { margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee; }
                            .result-label { font-weight: bold; }
                            .result-value { color: #0098EE; }
                        </style>
                    </head>
                    <body>
                        <h1>Calculator Results</h1>
                        ${resultsSection.innerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }

    // Utility methods for common business calculations
    calculateBreakEven(fixedCosts, variableCosts, price) {
        return fixedCosts / (price - variableCosts);
    }

    calculateGrossMargin(revenue, costOfGoods) {
        return ((revenue - costOfGoods) / revenue) * 100;
    }

    calculateNetProfitMargin(revenue, expenses) {
        return ((revenue - expenses) / revenue) * 100;
    }

    calculateCustomerLifetimeValue(averageOrderValue, purchaseFrequency, customerLifespan) {
        return averageOrderValue * purchaseFrequency * customerLifespan;
    }

    calculateCustomerAcquisitionCost(marketingSpend, newCustomers) {
        return marketingSpend / newCustomers;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.nikonomicsCalculator = new NikonomicsCalculator();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NikonomicsCalculator;
}
