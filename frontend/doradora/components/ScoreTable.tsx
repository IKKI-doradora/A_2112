import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';

const CONTENT = {
  tableHead: ['', 'PL1', 'PL2'],
  tableTitle: ['Total Score','R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
  tableData: [
    ['104', '69'],
    ['12', '20'],
    ['8', '4'],
    ['12', '13'],
    ['2', '1'],
    ['22', '18'],
    ['50', '3'],
  ],
};

export default function ScoreTable() {
  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1 }}>
        <Row
          data={CONTENT.tableHead}
          flexArr={[1, 1, 1, 1]}
          style={styles.head}
          textStyle={styles.text}
        />
        <TableWrapper style={styles.wrapper}>
          <Col
            data={CONTENT.tableTitle}
            style={styles.title}
            heightArr={[28, 28]}
            textStyle={styles.text}
          />
          <Rows
            data={CONTENT.tableData}
            flexArr={[1, 1]}
            style={styles.row}
            textStyle={styles.text}
          />
        </TableWrapper>
      </Table>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 10, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: 'orange' },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#2ecc71' },
  row: { height: 28 },
  text: { textAlign: 'center' },
});