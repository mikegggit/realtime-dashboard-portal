
Installation:

gradle 4.4
java 1.8
groovy 2.4.12

gradle
Use brew install gradle.


gradle bootRepackage 
build for cmd-line execution via java -jar...


# Create rpm
gradle clean
gradle bootRepackage
gradle createRpm

# Publish rpm
# create the rpm
gradle publishMavenRpmPublicationToMavenRepository
