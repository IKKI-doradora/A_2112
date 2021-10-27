import * as React from 'react';
import { View, StyleSheet,ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { useState } from 'react';

const CONTENT = {
  tableHead: ['', 'PL1', 'PL2'],
  // tableTitle: ['Total Score','R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
  widthArr: [60, 100, 100],
};

export default function ScoreTable() {
  const [state, setstate] = useState({tableHead:CONTENT.tableHead, widthArr:CONTENT.widthArr})
  const tableData = [];
  for (let i = 0; i < 10; i += 1) {
    const rowData = [];
    for (let j = 0; j < 3; j += 1) {
      rowData.push(`${i}${j}`);
    }
    tableData.push(rowData);
  }
  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text}/>
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              {
                tableData.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={state.widthArr}
                    style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                    textStyle={styles.text}
                  />
                ))
              }
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 1, paddingTop: 1},
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontWeight: '300' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
});