import { View, Text, StyleSheet } from "react-native";

export default function Appointments(){

 const list=[
  {title:"Bordetella booster",date:"Mar 15 2026",time:"10:00 AM"},
  {title:"6-month wellness check",date:"Apr 1 2026",time:"2:30 PM"},
  {title:"Spring grooming package",date:"May 5 2026",time:"11:00 AM"}
 ]

 return(
  <View style={styles.container}>
   <Text style={styles.title}>Upcoming Appointments</Text>

   {list.map((item,i)=>(
    <View key={i} style={styles.card}>
     <Text style={styles.name}>{item.title}</Text>
     <Text>{item.date}</Text>
     <Text>{item.time}</Text>
    </View>
   ))}

  </View>
 )
}

const styles=StyleSheet.create({
 container:{margin:16},
 title:{fontWeight:"700",marginBottom:10},
 card:{
  borderWidth:1,
  borderColor:"#60A5FA",
  borderRadius:12,
  padding:14,
  marginBottom:10
 },
 name:{fontWeight:"600"}
})