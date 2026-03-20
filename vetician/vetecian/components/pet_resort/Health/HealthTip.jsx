import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HealthTip(){
 return(
  <View style={styles.container}>
   <Text style={styles.title}>Health Tip of the Day</Text>

   <Text style={styles.text}>
    Regular dental care is essential for your pet's overall health. Brush
    your dog's teeth daily or at least 3 times a week.
   </Text>

   <TouchableOpacity style={styles.button}>
    <Text style={{color:"white"}}>Learn More</Text>
   </TouchableOpacity>

  </View>
 )
}

const styles=StyleSheet.create({
 container:{
  margin:16,
  padding:20,
  borderRadius:16,
  backgroundColor:"#5C9BD5"
 },
 title:{
  color:"white",
  fontWeight:"700",
  marginBottom:10
 },
 text:{
  color:"#EAF2FF",
  marginBottom:12
 },
 button:{
  backgroundColor:"#76B0E6",
  padding:10,
  borderRadius:10,
  alignSelf:"flex-start"
 }
})