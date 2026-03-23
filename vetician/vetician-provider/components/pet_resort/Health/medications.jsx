import { View, Text, StyleSheet } from "react-native";

export default function MedicalRecords(){

 const records=[
  {title:"Vaccination",desc:"Rabies booster",date:"Mar 1, 2026",doctor:"Dr. Sarah Johnson"},
  {title:"Checkup",desc:"Annual wellness exam",date:"Feb 15, 2026",doctor:"Dr. Michael Chen"},
 ]

 return(
  <View style={styles.container}>
   <Text style={styles.title}>Medical Records</Text>

   {records.map((item,i)=>(
    <View key={i} style={styles.card}>
      <Text style={styles.name}>{item.title}</Text>
      <Text>{item.desc}</Text>
      <Text>{item.date}</Text>
      <Text style={styles.doc}>{item.doctor}</Text>
    </View>
   ))}
  </View>
 )
}

const styles=StyleSheet.create({
 container:{
  margin:16
 },
 title:{
  fontWeight:"700",
  marginBottom:10
 },
 card:{
  backgroundColor:"white",
  padding:14,
  borderRadius:12,
  marginBottom:10
 },
 name:{
  fontWeight:"600"
 },
 doc:{
  marginTop:4,
  color:"#64748B"
 }
})