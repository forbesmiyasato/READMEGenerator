import React, { useEffect, useState, useLayoutEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import config from "../config";
import axios from "axios";
import TextForm from "./textForm";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "./modal";
import Preview from "./preview";
import { useAlert, types } from "react-alert";
import {
    CodeSlash,
    CloudUpload,
    Eye,
    BootstrapReboot,
    ArrowBarLeft,
} from "react-bootstrap-icons";
import "../css/app.css";
import DraggableList from "./DraggableList";

const TITLE_KEY = "title";
const DESCRIPTION_KEY = "description";
const INTRODUCTION_KEY = "introduction";
const INSTALLATION_KEY = "get_started";
const USAGE_KEY = "usage";
const CONTRIBUTE_KEY = "contribute";
const ACKNOWLEDGEMENTS_KEY = "acknowledgements";
const TECHNOLOGIES_KEY = "technologies";
const ORDER_KEY = "order";

const App = () => {
    const [gitHubInfo, setGitHubInfo] = useState({
        username: "",
        accessToken: "",
        userRepoUrl: "",
    });
    const [repos, setRepos] = useState([]);
    const [markdown, setMarkdown] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [intro, setIntro] = useState("");
    const [installation, setInstallation] = useState("");
    const [usage, setUsage] = useState("");
    const [contribute, setContribute] = useState("");
    const [acknowledgements, setAcknowledgements] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [modalType, setModalType] = useState("");
    const [order, setOrder] = useState([0, 1, 2, 3]); // 0 - installation, 1 - usage, 2 - contribute, 3 - acknowledgements
    const alert = useAlert();

    //initialize firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    //set up the provider for firebase authentication
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope("repo");

    //Sign out the user using firebase authentication
    const signOut = () => {
        firebase
            .auth()
            .signOut()
            .then(function () {
                setGitHubInfo({
                    username: "",
                    accessToken: "",
                    userRepoUrl: "",
                    repos: [],
                });
                alert.show("Signed out of Github successfully!", {
                    type: types.SUCCESS,
                });
            })
            .catch(function (error) {
                alert.show(error, {
                    type: types.ERROR,
                });
            });
    };

    //Prevent the form from being submitted when user presses enter
    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
        console.log("test");
    };

    //The following 7 methods are to handle user data input.
    //Function names are descriptive to their use case.
    //Sets content for each section to the current input value.
    const handleTitleChange = (element) => {
        setTitle(element.target.value);
    };

    const handleDescriptionChange = (element) => {
        setDescription(element.target.value);
    };

    const handleIntroChange = (element) => {
        setIntro(element.target.value);
    };

    const handleInstallationChange = (element) => {
        setInstallation(element.target.value);
    };

    const handleUsageChange = (element) => {
        setUsage(element.target.value);
    };

    const handleContributeChange = (element) => {
        setContribute(element.target.value);
    };

    const handleAcknowledgementsChange = (element) => {
        setAcknowledgements(element.target.value);
    };

    //Handles the preview button being clicked. Opens the modal in preview mode.
    const handlePreviewClick = () => {
        setModalShow(true);
        setModalType("Preview");
    };

    //Handles the markdown button being clicked. Opens the modal in markdown mode.
    const handleMarkdownClick = () => {
        setModalShow(true);
        setModalType("Markdown");
    };

    //If the user hasn't logged in yet, logs in the user using Firebase authentication. Else,
    //Opens the repository list modal.
    const HandleUploadToGitHubClicked = () => {
        if (!gitHubInfo.username) {
            firebase
                .auth()
                .signInWithPopup(provider)
                .then(async function (result) {
                    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var username = result.additionalUserInfo.username;
                    // The url to fetch all users public repositories
                    var url = result.additionalUserInfo.profile.repos_url;
                    // We want the repo list modal to show up next
                    setGitHubInfo({
                        ...gitHubInfo,
                        accessToken: token,
                        username: username,
                        userRepoUrl: url,
                    });

                    alert.show(`Hi ${result.user.displayName}!`, {
                        type: types.SUCCESS,
                    });
                })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorMessage = error.message;
                    alert.show(errorMessage, {
                        type: types.ERROR,
                    });
                });
        } else {
            setModalShow(true);
            setModalType("github");
        }
    };

    //Uploads the readme content to the Github repository.
    const uploadReadMeToGithub = async (repoName) => {
        let success = true;
        setModalShow(false);
        try {
            //In order to update the README content, a sha parameter is required in the request body.
            //The sha value is unique to each commit. In order to get the proper sha value, we need to make
            //a get request to fetch the latest sha.
            //This request will fail and redirect to the catch block below if the README.md file doesn't exist.
            //In this case we want to create the README file instead of updating it. Hence, the sha value isn't needed.
            let response = await axios.get(
                `https://api.github.com/repos/${gitHubInfo.username}/${repoName}/contents/README.md`
            );
            let sha = response.data.sha;

            //Now update the README content
            await axios.put(
                `https://api.github.com/repos/${gitHubInfo.username}/${repoName}/contents/README.md`,
                {
                    message: "Update README.md from Forbes' README Generator",
                    content: btoa(unescape(encodeURIComponent(markdown))),
                    sha: sha,
                },
                {
                    headers: {
                        Authorization: `token ${gitHubInfo.accessToken}`,
                        Accept: "application/vnd.github.v3+json",
                    },
                }
            );
        } catch (err) {
            //Failed to get content of README.md because it doesn't exist. In this case, we want to create the README.md file.
            try {
                await axios.put(
                    `https://api.github.com/repos/${gitHubInfo.username}/${repoName}/contents/README.md`,
                    {
                        message:
                            "Updated README.md with Forbes's README Generator",
                        content: btoa(unescape(encodeURIComponent(markdown))),
                    },
                    {
                        headers: {
                            Authorization: `token ${gitHubInfo.accessToken}`,
                            Accept: "application/vnd.github.v3+json",
                        },
                    }
                );
            } catch (err) {
                //Show alert if failed to upload to Github.
                success = false;
                alert.show("Failed to Upload to Github :(", {
                    type: types.ERROR,
                });
            }
        }
        //If didn't fail to upload to Github, show success alert that contains url to redirect user to the repository.
        if (success) {
            alert.show(
                <div>
                    Uploaded to GitHub successfully!{" "}
                    <a
                        href={`https://github.com/${gitHubInfo.username}/${repoName}`}
                        rel="noreferrer"
                        target="_blank"
                    >
                        Click Here
                    </a>{" "}
                    to check it out.
                </div>,
                {
                    type: types.SUCCESS,
                }
            );
        }
    };

    //Resets all the README text inputs and clears entries in local storage.
    const resetInputs = () => {
        setMarkdown("");
        setTitle("");
        setDescription("");
        setIntro("");
        setInstallation("");
        setUsage("");
        setContribute("");
        setAcknowledgements("");
        localStorage.clear();
    };

    //use ref to preserve the value after each rerender
    let textForms = [
        <TextForm
            id="form-installation "
            label="Get Started"
            placeholder="Installation instructions..."
            as="textarea"
            value={installation}
            onChange={handleInstallationChange}
        />,
        <TextForm
            id="form-usage"
            label="Usage"
            placeholder="Explain how to use this project..."
            as="textarea"
            value={usage}
            onChange={handleUsageChange}
        />,
        <TextForm
            id="form-contribute"
            label="Contribute"
            placeholder="Explain how people can contribute to this project..."
            as="textarea"
            value={contribute}
            onChange={handleContributeChange}
        />,
        <TextForm
            id="form-acknowledgement"
            label="Acknowledgements"
            placeholder="Anybody you wish to thank for helping or collaborating with you on this project..."
            as="textarea"
            value={acknowledgements}
            onChange={handleAcknowledgementsChange}
        />,
    ];

    //Initialize fields if they exist in local storage
    useEffect(() => {
        const localTitle = localStorage.getItem(TITLE_KEY) || "";
        const localDescription = localStorage.getItem(DESCRIPTION_KEY) || "";
        const localIntroduction = localStorage.getItem(INTRODUCTION_KEY) || "";
        const localInstallation = localStorage.getItem(INSTALLATION_KEY) || "";
        const localUsage = localStorage.getItem(USAGE_KEY) || "";
        const localContribute = localStorage.getItem(CONTRIBUTE_KEY) || "";
        const localAcknowledgements =
            localStorage.getItem(ACKNOWLEDGEMENTS_KEY) || "";

        let localOrder = localStorage.getItem(ORDER_KEY);
        localOrder = localOrder ? JSON.parse(localOrder) : [0, 1, 2, 3];

        setTitle(localTitle);
        setDescription(localDescription);
        setIntro(localIntroduction);
        setInstallation(localInstallation);
        setUsage(localUsage);
        setContribute(localContribute);
        setAcknowledgements(localAcknowledgements);
        setOrder(localOrder);
    }, []);

    console.log(order);
    //Reorder text forms based on the order. We technically only want this to happen when the page first loads to
    //list the input fields in the order saved in localstorage. I tried couple ways but couldn't get it to work for only first load.
    //TODO: Reorder text forms only onload instead of every rerender.
    // useLayoutEffect(() => {
    //     const reorder = () => {
    //         console.log("called");
    //         let newTextForms = [];
    //         order.forEach((num) => {
    //             console.log(num);
    //             console.log(textForms[num].props.label);
    //             newTextForms.push(textForms[num]);
    //         });

    //         textForms = newTextForms;
    //     };

    //     reorder();
    // }, []);

    //Fetch user repo, whenever user repo url changes (happens once user is authenticated)
    useEffect(() => {
        // Fetch users repositories to display
        const fetchUserRepo = async () => {
            let response = await axios.get(gitHubInfo.userRepoUrl);

            //Create a list with just the name and id attribute
            let repos = [];

            response.data.forEach(({ id, name }) => {
                if (name) {
                    let repo = {};
                    repo["id"] = id;
                    repo["name"] = name;
                    repos.push(repo);
                }
            });

            setRepos(repos);
            setModalShow(true);
            setModalType("github");
        };

        if (gitHubInfo.userRepoUrl) {
            fetchUserRepo();
        }
    }, [gitHubInfo]);

    //Update the markdown content everytime an input field is modified and save it to local storage.
    useEffect(() => {
        let markdown = "";
        if (title) {
            markdown += `# ${title.trim()}\n\n`;
            localStorage.setItem(TITLE_KEY, title);
            if (description) {
                markdown += `${description.trim()}\n\n<br />\n\n`;
                localStorage.setItem(DESCRIPTION_KEY, description);
            }
            markdown += "### Welcome to " + title.trim() + "!\n\n<hr>\n\n";
        }

        if (intro) {
            markdown += `${intro.trim()}\n\n<br />\n\n\n`;
            localStorage.setItem(INTRODUCTION_KEY, intro);
        }

        order.forEach((num) => {
            if (num === 0 && installation) {
                markdown +=
                    '### Get Started <g-emoji class="g-emoji" alias="rocket" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f680.png">🚀</g-emoji>\n\n<hr>\n\n' +
                    installation.trim() +
                    "\n\n<br />\n\n";
                localStorage.setItem(INSTALLATION_KEY, installation);
            }

            if (num === 1 && usage) {
                markdown +=
                    '### Usage <g-emoji class="g-emoji" alias="gear" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2699.png">⚙</g-emoji>\n\n<hr>\n\n' +
                    usage.trim() +
                    "\n\n<br />\n\n";
                localStorage.setItem(USAGE_KEY, usage);
            }

            if (num === 2 && contribute) {
                markdown +=
                    '### Contribute <g-emoji class="g-emoji" alias="toolbox" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f9f0.png">🧰</g-emoji>\n\n<hr>\n\n' +
                    contribute.trim() +
                    "\n\n<br />\n\n";
                localStorage.setItem(CONTRIBUTE_KEY, contribute);
            }

            if (num === 3 && acknowledgements) {
                markdown +=
                    '### Acknowledgements <g-emoji class="g-emoji" alias="blue_heart" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f499.png">💙</g-emoji>\n\n<hr>\n\n' +
                    acknowledgements.trim() +
                    "\n\n<br />\n\n";
                localStorage.setItem(ACKNOWLEDGEMENTS_KEY, acknowledgements);
            }
        });

        localStorage.setItem(ORDER_KEY, JSON.stringify(order));
        setMarkdown(markdown);
    }, [
        title,
        description,
        intro,
        installation,
        usage,
        contribute,
        acknowledgements,
        order,
    ]);

    const onOrderSwap = (order) => {
        setOrder(order);
    };

    return (
        <div className="App">
            <h1 className="App-header mt-3 text-center">
                GitHub README Generator
            </h1>
            <Container className="border border-light shadow-sm rounded p-2 bg-white">
                <Row>
                    <Col sm>
                        <Form>
                            <TextForm
                                id="form-title"
                                label="Title"
                                type="text"
                                placeholder="Project name..."
                                text="All inputs are currently optional"
                                value={title}
                                onChange={handleTitleChange}
                                onKeyDown={handleKeyDown}
                            />
                            <TextForm
                                id="form-description"
                                label="Description"
                                as="textarea"
                                placeholder="Brief Description..."
                                text="This field will only be generated if the title is present"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                            <TextForm
                                id="form-intro"
                                label="Introduction"
                                as="textarea"
                                placeholder="Why did you create this project..."
                                value={intro}
                                onChange={handleIntroChange}
                            />
                            <DraggableList
                                items={textForms}
                                onDown={onOrderSwap}
                                order={order}
                            />
                        </Form>
                    </Col>
                    <Col sm className="flex-column d-none d-sm-flex">
                        <label>Preview</label>
                        <Preview markdown={markdown} />
                    </Col>
                </Row>
                <p className="note mt-2 mb-2">
                    This generator works as a starting point. You can reference
                    the{" "}
                    <a
                        href="https://docs.github.com/en/free-pro-team@latest/github/writing-on-github/basic-writing-and-formatting-syntax"
                        target="_blank"
                        rel="noreferrer"
                    >
                        docs
                    </a>{" "}
                    to furthur customize it to suit your needs.
                </p>
                <div>
                    <Button
                        variant="outline-primary mr-2 mb-2"
                        onClick={handleMarkdownClick}
                    >
                        <CodeSlash /> Get Markdown
                    </Button>
                    <Button
                        variant="outline-success mr-2 mb-2"
                        onClick={HandleUploadToGitHubClicked}
                    >
                        <CloudUpload /> Upload To Github
                    </Button>
                    <Button
                        variant="outline-info mr-2 mb-2"
                        onClick={handlePreviewClick}
                        className="d-sm-none"
                    >
                        <Eye /> Preview
                    </Button>
                    {gitHubInfo.username && (
                        <Button
                            variant="outline-warning mr-2 mb-2"
                            onClick={signOut}
                        >
                            <ArrowBarLeft /> Sign out of Github
                        </Button>
                    )}
                    <Button
                        variant="outline-danger mr-2 mb-2"
                        onClick={resetInputs}
                    >
                        <BootstrapReboot /> Reset All Inputs
                    </Button>
                </div>
            </Container>
            <footer className="text-center mt-3 mb-5">
                Made by{" "}
                <a href="https://www.forbesmiyasato.com">Forbes Miyasato</a>
            </footer>
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                markdown={markdown}
                repos={repos}
                type={modalType}
                onRepoSelect={uploadReadMeToGithub}
            />
        </div>
    );
};

export default App;
