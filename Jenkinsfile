pipeline {

  agent any

  stages {

    stage("dev") {

      steps {
        echo 'Building the app.'
        sh 'yarn install'
        sh 'yarn build'
        sh 'yarn test'
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