pipeline {

  agent any

  stages {

    stage("dev") {

      steps {
        echo 'Building the app.'
        nodejs('Node-14.15.1') {
          sh 'yarn install'
          sh 'yarn test'
        }
      }
    }

    stage("test") {

      steps {
        echo 'Testing the app.'
      }
    }

    stage("product") {

      steps {
        echo 'Deploying the app.'
      }
    }
  }
}