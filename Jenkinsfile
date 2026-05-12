// ═══════════════════════════════════════════════════════════════════
// CampusOps — Jenkins Declarative Pipeline
// Triggers: GitHub webhook on push to main or develop branches
// Stages: Checkout → Deps → Lint → Tests → E2E → Docker → Deploy
// ═══════════════════════════════════════════════════════════════════

pipeline {
    agent any

    environment {
        DOCKER_REGISTRY    = 'registry.campusops.local'
        IMAGE_NAME         = 'campusops'
        IMAGE_TAG          = "${env.BUILD_NUMBER}"
        NODE_VERSION       = '20'
        STAGING_SERVER     = 'staging.campusops.local'
        PROD_SERVER        = 'campusops.local'
        SLACK_CHANNEL      = '#devops-alerts'
        COVERAGE_THRESHOLD = '80'
    }

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    triggers {
        githubPush()
    }

    stages {

        // ─── Stage 1: Checkout ────────────────────────────────
        stage('Checkout') {
            steps {
                git branch: "${env.BRANCH_NAME ?: 'main'}",
                    url: 'https://github.com/your-org/CampusOps.git',
                    

                script {
                    env.GIT_SHORT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.GIT_AUTHOR      = sh(script: 'git log -1 --format="%an"',   returnStdout: true).trim()
                }
                echo "Build #${BUILD_NUMBER} | Commit: ${GIT_SHORT_COMMIT} | Author: ${GIT_AUTHOR}"
            }
        }

        // ─── Stage 2: Install Dependencies (parallel) ─────────
        stage('Install Dependencies') {
            parallel {
                stage('Server Deps') {
                    steps {
                        dir('server') {
                            sh 'npm ci --prefer-offline'
                        }
                    }
                }
                stage('Client Deps') {
                    steps {
                        dir('client') {
                            sh 'npm ci --prefer-offline'
                        }
                    }
                }
            }
        }

        // ─── Stage 3: Lint & Security Audit ───────────────────
        stage('Lint & Security Audit') {
            parallel {
                stage('Server Lint') {
                    steps {
                        dir('server') {
                            sh 'npx eslint . --ext .js --format=checkstyle --output-file=eslint-server.xml || true'
                            sh 'npm audit --audit-level=high'
                        }
                    }
                }
                stage('Client Lint') {
                    steps {
                        dir('client') {
                            sh 'npx eslint src/ --ext .js,.jsx --format=checkstyle --output-file=eslint-client.xml || true'
                        }
                    }
                }
            }
        }

        // ─── Stage 4: Unit & Integration Tests (Jest) ─────────
        stage('Unit & Integration Tests') {
            steps {
                dir('server') {
                    sh 'npm test -- --coverage --ci --reporters=jest-junit'
                }
            }
            post {
                always {
                    junit         'server/junit.xml'
                    publishHTML([
                        allowMissing: false,
                        reportDir:    'server/coverage/lcov-report',
                        reportFiles:  'index.html',
                        reportName:   'Server Coverage Report'
                    ])
                    script {
                        def coverage = sh(
                            script: "node -e \"const c=require('./server/coverage/coverage-summary.json'); console.log(Math.round(c.total.lines.pct))\"",
                            returnStdout: true
                        ).trim().toInteger()
                        if (coverage < env.COVERAGE_THRESHOLD.toInteger()) {
                            error "Coverage ${coverage}% is below threshold of ${COVERAGE_THRESHOLD}%"
                        }
                        echo "✅ Coverage: ${coverage}% (threshold: ${COVERAGE_THRESHOLD}%)"
                    }
                }
            }
        }

        // ─── Stage 5: React Component Tests ───────────────────
        stage('Frontend Tests') {
            steps {
                dir('client') {
                    sh 'CI=true npm test -- --watchAll=false --coverage --reporters=jest-junit'
                }
            }
            post {
                always { junit 'client/junit.xml' }
            }
        }

        // ─── Stage 6: E2E Tests (Selenium) ────────────────────
        stage('E2E Tests (Selenium)') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                sh 'docker-compose -f docker-compose.test.yml up -d'
                sh 'sleep 15'   // Wait for services to be ready
                dir('e2e') {
                    sh 'npm ci'
                    sh 'npm run test:e2e'
                }
            }
            post {
                always {
                    sh 'docker-compose -f docker-compose.test.yml down -v'
                    junit 'e2e/junit.xml'
                }
            }
        }

        // ─── Stage 7: Build Docker Images ─────────────────────
        stage('Build Docker Images') {
            when { not { branch 'feature/*' } }
            steps {
                script {
                    sh """
                        docker build \\
                            --cache-from ${DOCKER_REGISTRY}/${IMAGE_NAME}-api:latest \\
                            -t ${DOCKER_REGISTRY}/${IMAGE_NAME}-api:${IMAGE_TAG} \\
                            -t ${DOCKER_REGISTRY}/${IMAGE_NAME}-api:latest \\
                            ./server
                    """
                    sh """
                        docker build \\
                            --cache-from ${DOCKER_REGISTRY}/${IMAGE_NAME}-web:latest \\
                            --build-arg REACT_APP_VERSION=${IMAGE_TAG} \\
                            -t ${DOCKER_REGISTRY}/${IMAGE_NAME}-web:${IMAGE_TAG} \\
                            -t ${DOCKER_REGISTRY}/${IMAGE_NAME}-web:latest \\
                            ./client
                    """
                    withCredentials([usernamePassword(credentialsId: 'docker-registry', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "docker login ${DOCKER_REGISTRY} -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                        sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}-api:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}-web:${IMAGE_TAG}"
                    }
                }
            }
        }

        // ─── Stage 8: Deploy to Staging (Ansible) ─────────────
        stage('Deploy to Staging') {
            when { not { branch 'feature/*' } }
            steps {
                withCredentials([file(credentialsId: 'ansible-vault-pass', variable: 'VAULT_PASS')]) {
                    ansiblePlaybook(
                        playbook:   'ansible/deploy-staging.yml',
                        inventory:  'ansible/inventory/staging',
                        extras:     "--vault-password-file ${VAULT_PASS} -e image_tag=${IMAGE_TAG}",
                        colorized:  true
                    )
                }
            }
        }

        // ─── Stage 9: Smoke Tests ─────────────────────────────
        stage('Smoke Tests') {
            when { not { branch 'feature/*' } }
            steps {
                sh """
                    for i in 1 2 3 4 5; do
                        if curl -sf http://${STAGING_SERVER}/health; then
                            echo "✅ Staging health check passed"
                            exit 0
                        fi
                        echo "Attempt \$i failed, retrying in 10s..."
                        sleep 10
                    done
                    echo "❌ Staging health check failed after 5 attempts"
                    exit 1
                """
            }
        }

        // ─── Stage 10: Deploy to Production (Ansible) ─────────
        stage('Deploy to Production') {
            when {
                allOf {
                    branch 'main'
                    not { changeRequest() }
                }
            }
            input {
                message "Deploy build #${BUILD_NUMBER} to PRODUCTION?"
                ok      "Deploy"
                submitter "admin,release-team"
            }
            steps {
                withCredentials([file(credentialsId: 'ansible-vault-pass', variable: 'VAULT_PASS')]) {
                    ansiblePlaybook(
                        playbook:   'ansible/deploy-production.yml',
                        inventory:  'ansible/inventory/production',
                        extras:     "--vault-password-file ${VAULT_PASS} -e image_tag=${IMAGE_TAG}",
                        colorized:  true
                    )
                }
            }
        }

    }

    post {
        success {
            echo "✅ Pipeline succeeded — Build #${BUILD_NUMBER}"
            //slackSend(
               // channel: env.SLACK_CHANNEL,
                //color:   'good',
                //message: "✅ CampusOps Build #${BUILD_NUMBER} deployed successfully\nCommit: ${env.GIT_SHORT_COMMIT} by ${env.GIT_AUTHOR}\nBranch: ${env.BRANCH_NAME}"
            //)
        }
        failure {
            echo "❌ Pipeline FAILED — Build #${BUILD_NUMBER}"
            //slackSend(
                //channel: env.SLACK_CHANNEL,
                //color:   'danger',
              //  message: "❌ CampusOps Build #${BUILD_NUMBER} FAILED\nCommit: ${env.GIT_SHORT_COMMIT}\nCheck: ${env.BUILD_URL}"
            //)
        }
        always {
            cleanWs()
        }
    }
}
