import React from 'react';
import {
    ImageBackground,
    Text,
    View,
    TextInput
} from 'react-native';
import { useState } from 'react/cjs/react.development';

import { styles } from './styles';

export const BarcodeRow = ({ result = {} }) => {
    const { data, symbology } = result;
    const [count, setcount] = useState(result.itemCount);
    const updateValue = (x) => {
        setcount(x);
        result.itemCount = x
    }
    return (
        <View style={styles.result}>
            <ImageBackground source={require('./images/barcode_black.png')} style={styles.resultImage} />

            <View style={styles.resultDataContainer}>
                <Text style={styles.resultSymbology}>{symbology}</Text>
                <Text style={styles.resultData}>{data}</Text>

                <View style={styles.resultStockContainer}>
                    <View style={styles.resultStockCircle}>
                        <Text style={styles.resultStockCircleText}>-</Text>
                    </View>
                    <TextInput 
                        style={styles.input}
                        keyboardType='number-pad'
                        onChangeText={x => updateValue(x)}
                        value={result.itemCount.toString()}
                    />
                    
                    
    
                    <View style={styles.resultStockCircle}>
                        <Text style={styles.resultStockCircleText}>+</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}