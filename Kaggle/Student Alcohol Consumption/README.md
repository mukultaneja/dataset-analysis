
# Description :
 This dataset containts social,gender and study data from secondary school students. The data were obtained in a survey of students math and portuguese language courses in secondary school. It contains a lot of interesting social,gender and study information about students. You can use it for some EDA or try to predict students final grade.

# Contents :
 This datasets has many columns like school,sex,age,address,famsize,Pstatus,Medu,Fedu,Mjob,Fjob,reason,guardian,traveltime,studytime,failures,schoolsup,famsup,paid,activities nursery,higher,internet,romantic,famrel,freetime,goout,Dalc,Walc,health,absences,G1,G2,G3 (grades).
 Dataset URL : [https://www.kaggle.com/uciml/student-alcohol-consumption][1]

 [1]: https://www.kaggle.com/uciml/student-alcohol-consumption
 
# Motivation :
 I found this dataset very fascinating as it contains many columns about students which say many things about their grades,performance,family and other factors related to thier personal life. I could find multiple stories from this dataset but as of now,I only want to focus over the performance of students. For this purpose,I found multiple parameters which I can use and they affect the performance of students for example address / alcohol consumption / Pstatus / Medu / Fedu / Mjob / Fjob / famsup / schoolsup.

# Goal :
 I want to understand how these parameters are impacting performance of students and how students are progressing while dealing with these parameters in their life.

# Proceedings :
 : In terms of proceedings,First I am dividing this datasets based on the address field and getting data for 'rural' and 'urban' areas students.

 : After getting these two parts,I have started over the analysis with the help of 'Dalc' field which says how much amount of alcohol consumption is been regualrly taken by the students on the daily basis. I am trying to find out the impact of this consumption over their performance in exams.
 
 : Secondly,I find 'Pstatus' field is very important to analysis the same. This field tells that for how many students parents are seperated or living together. I thought this field can be very useful to analyse their performance as it is a very emotional / mind / time consuming matter for all the generation nowadays.

 : After these two fields,when I looked into in this datasets,then I reliaze that apart from the region,the education of parents and family support can also be good factors for affecting the performance of students. So I have also used these fields to get insights more about performance.

 At the end,I have used school support and higher education field to get insight about how school helps students and what students think about their future as they are the one who will decide the future of nation.

# Notes :
 * I have targetted only math class students for this analysis.
 * we have in total 395 rows approx in which 88 belogns to rural region and 307 belongs to urban.