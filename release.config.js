module.exports = {
  branches: ["master"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md"]
      }
    ],
    [
      "@codedependant/semantic-release-docker",
      {
        dockerTags: ["latest", "{{version}}", "{{major}}-latest", "{{major}}.{{minor}}"],
        dockerImage: "erin",
        dockerFile: "Dockerfile",
        dockerProject: "codedependant",
        dockerPlatform: ["linux/amd64", "linux/arm64", "linux/arm/v7"],
        dockerBuildFlags: {
          pull: null,
          target: "release"
        },
        dockerArgs: {
          RELEASE_DATE: new Date().toISOString(),
        }
      }
    ]
  ]
};
