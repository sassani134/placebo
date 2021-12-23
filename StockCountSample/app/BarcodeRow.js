import React from 'react';
import {
    ImageBackground,
    Text,
    View,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { useState, useEffect } from 'react/cjs/react.development';

import { styles } from './styles';

export const BarcodeRow = ({ result = {} }) => {



    const { data, symbology } = result;
    const [count, setCount] = useState(result.itemCount);
    const [display, setDisplay] = useState(result.itemCount);

 




    useEffect(() => {
        console.log("RESULT.ITEM COUNT")
        console.log("RESULT.ITEM COUNT")
        console.log(count)
        console.log(result.itemCount)
        console.log("RESULT.ITEM COUNT")
        console.log("RESULT.ITEM COUNT")
        result.itemCount = count;
        setDisplay(result.itemCount)
        console.log("AFTER RESULT.ITEM COUNT")
        console.log("AFTER RESULT.ITEM COUNT")
        console.log(count)
        console.log(result.itemCount)
        console.log("AFTER RESULT.ITEM COUNT")
        console.log("AFTER RESULT.ITEM COUNT")
      }, [count]); // Only re-run the effect if count changes


    useEffect(() => {
        setDisplay(result.itemCount)
    }, [result.itemCount]); // Only re-run the effect if count changes
    


    
    //result.itemCount = 888
    //const [count, setCount] = useState(result.itemCount);
    // const updateValue = (x) => {

    //     console.log('counttttttttttttttttt')
    //     console.log(count)
    //     console.log('counttttttttttttttttt')



        
    //     setcount(0);
    //     setcount(x);
    //     result.itemCount = 888
    // }


    // const minusButton = () => {
    //     console.log("MINUS BUTTONNNNNNNN");
    //     console.log(result);
    //     console.log("MINUS BUTTONNNNNNNN");
    //     if(result.itemCount <= 0){
    //         console.log('faut plus que je m affiche');
    //     } else {
    //         setCount(result.itemCount - 1)
    //         result.itemCount = result.itemCount - 1;
    //     }
    //     console.log('-1');
    // }
    //
    // const plusButton = () => {
    //     console.log("BEFORE SETCOUNT")
    //     console.log("BEFORE SETCOUNT")
    //     console.log(count)
    //     console.log(result.itemCount)
    //     console.log("BEFORE SETCOUNT")
    //     console.log("BEFORE SETCOUNT")
        
    //     setCount(result.itemCount + 1);

    //     console.log("AFTER SET COUNT")
    //     console.log("AFTER SET COUNT")
    //     console.log(count)
    //     console.log(result.itemCount)
    //     console.log("AFTER SET COUNT")
    //     console.log("AFTER SET COUNT")
        
    //     result.itemCount = result.itemCount + 1;
    // }

    

    return (
        <View style={styles.result}>
            <ImageBackground source={require('./images/barcode_black.png')} style={styles.resultImage} />

            <View style={styles.resultDataContainer}>
                <Text style={styles.resultSymbology}>{symbology}</Text>
                <Text style={styles.resultData}>{data}</Text>




                <View style={styles.resultStockContainer}>
                    <View style={styles.resultStockCircle}>
                        <TouchableOpacity onPress={() => setCount(result.itemCount - 1)}>
                            <Text style={styles.resultStockCircleText}>-</Text>
                        </TouchableOpacity>
                    </View>


                    <Text style={styles.resultStockCount}>{display}</Text>    
                    
    
                    <View style={styles.resultStockCircle}>
                        <TouchableOpacity onPress={() => setCount(result.itemCount + 1)}>
                            <Text style={styles.resultStockCircleText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}