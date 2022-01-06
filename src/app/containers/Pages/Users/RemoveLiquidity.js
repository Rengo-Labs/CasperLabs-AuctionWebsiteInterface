import { Avatar, Card, CardContent, CardHeader } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import {
    CasperClient, CLAccountHash, CLByteArray, CLKey, CLOption, CLPublicKey, CLValueBuilder, DeployUtil, RuntimeArgs, Signer
} from 'casper-js-sdk';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import Spinner from "react-bootstrap/Spinner";
import windowSize from "react-window-size";
import { Some } from "ts-results";
import "../../../assets/css/bootstrap.min.css";
import "../../../assets/css/style.css";
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import { ROUTER_CONTRACT_HASH, ROUTER_PACKAGE_HASH } from '../../../components/blockchain/AccountHashes/Addresses';
import { NODE_ADDRESS } from '../../../components/blockchain/NodeAddress/NodeAddress';
import HeaderHome from "../../../components/Headers/Header";
import RangeSlider from 'react-bootstrap-range-slider';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    badge: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    avatar: {
        height: '20px',
        width: '20px',
    },
    card: {
        minWidth: 250,
    },
    media: {
        height: 0,
        paddingTop: '100%', // 16:9
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}));
// let RecipientType = CLPublicKey | CLAccountHash | CLByteArray;
function RemoveLiquidity(props) {
    const classes = useStyles();
    let { tokenAAddress, tokenBAddress } = useParams()
    // console.log("tokenAAddress",tokenAAddress);
    const { enqueueSnackbar } = useSnackbar();
    let [priceInUSD, setPriceInUSD] = useState(0);
    let [tokenA, setTokenA] = useState();
    let [tokenB, setTokenB] = useState();
    let [tokenAAmount, setTokenAAmount] = useState(0);
    let [tokenBAmount, setTokenBAmount] = useState(0);
    let [tokenAAmountPercent, setTokenAAmountPercent] = useState(tokenAAmount);
    let [tokenBAmountPercent, setTokenBAmountPercent] = useState(tokenBAmount);
    let [pair, setPairHash] = useState();
    let [liquidity, setLiquidity] = useState();
    let [activePublicKey, setActivePublicKey] = useState(localStorage.getItem("Address"));
    const [value, setValue] = useState(25);
    let [approveAIsLoading, setApproveAIsLoading] = useState(false);


    const [tokenList, setTokenList] = useState([])
    const [pairList, setPairList] = useState([])
    const [istokenList, setIsTokenList] = useState(false)
    const [ispairList, setIsPairList] = useState(false)
    let [isLoading, setIsLoading] = useState(false);
    let [msg, setMsg] = useState("");


    let handleSubmitEvent = (event) => {
        setMsg("");
        event.preventDefault();

    };
    useEffect(() => {
        axios
            .get('/tokensList')
            .then((res) => {
                // console.log('resresres', res)
                console.log(res.data.tokens)
                for (let i = 0; i < res.data.tokens.length; i++) {
                    let address = res.data.tokens[i].address.toLowerCase();
                    if (address.includes(tokenAAddress.toLowerCase())) {
                        console.log('res.data.tokensA.address', res.data.tokens[i].address);
                        setTokenA(res.data.tokens[i])
                    }
                    if (address.includes(tokenBAddress.toLowerCase())) {
                        console.log('res.data.tokensB.address', res.data.tokens[i].address);
                        setTokenB(res.data.tokens[i])
                    }

                }
                setIsTokenList(true)
                setTokenList(res.data.tokens)
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })// eslint-disable-next-line
        axios
            .post("priceconversion", {
                symbolforconversion: "CSPR",
                symboltoconvertto: "USD",
                amount: 1
            })
            .then((response) => {
                console.log("response", response.data.worth.USD);
                setPriceInUSD(response.data.worth.USD.price);
            })
            .catch((error) => {
                console.log("response", error.response);
            });
    }, []);
    useEffect(() => {
        let param = {
            user: activePublicKey
        }
        axios
            .post('/getpairsagainstuser', param)
            .then((res) => {
                console.log('9', res)
                console.log(res.data.userpairs)
                setIsPairList(true)
                for (let i = 0; i < res.data.userpairs.length; i++) {
                    let address0 = res.data.userpairs[i].token0.id.toLowerCase();
                    let address1 = res.data.userpairs[i].token1.id.toLowerCase();
                    if ((address0.includes(tokenAAddress.toLowerCase()) && address1.includes(tokenBAddress.toLowerCase())) || (address0.includes(tokenBAddress.toLowerCase()) && address1.includes(tokenAAddress.toLowerCase()))) {
                        console.log('res.data.', res.data.userpairs[i]);
                        setTokenAAmount(res.data.userpairs[i].reserve0)
                        setTokenBAmount(res.data.userpairs[i].reserve1)
                        setPairHash(res.data.userpairs[i].id)
                        setTokenAAmountPercent(res.data.userpairs[i].reserve0 * value / 100)
                        setTokenBAmountPercent(res.data.userpairs[i].reserve1 * value / 100)

                        let param = {
                            to: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"),
                            pairid: res.data.userpairs[i].id
                        }
                        console.log('await Signer.getSelectedPublicKeyBase64()',
                            Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"))

                        axios
                            .post('/liquidityagainstuserandpair', param)
                            .then((res1) => {
                                console.log('liquidityagainstuserandpair', res1)
                                setLiquidity(res1.data.liquidity)
                                console.log("res1.data.liquidity", res1.data.liquidity)
                            })
                            .catch((error) => {
                                console.log(error)
                                console.log(error.response)
                            })

                        // setTokenA(res.data.tokens[i])
                    }
                    // if () {
                    //     console.log('res.data.tokensB.address', res.data.tokens[i].address);
                    //     setTokenB(res.data.tokens[i])
                    // }
                }
                setPairList(res.data.pairList)
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response)
            })// eslint-disable-next-line
    }, [activePublicKey]);

    //     https://casper-uniswap-v2-graphql.herokuapp.com/liquidityagainstuserandpair
    // {
    //     "to":"8b217a09296d5ce360847a7d20f623476157c5f022333c4e988a464035cadd80",
    //     "pairid":"9c2aa298dc8f7bc10a7e57d005ed0a4c97597c963368246c51671c0794a48707"
    // }
    function createRecipientAddress(recipient) {
        if (recipient instanceof CLPublicKey) {
            return new CLKey(new CLAccountHash(recipient.toAccountHash()));
        } else {
            return new CLKey(recipient);
        }
    };
    async function approveMakedeploy() {
        const publicKeyHex = activePublicKey
        if (publicKeyHex !== null && publicKeyHex !== 'null' && publicKeyHex !== undefined) {
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const spender = ROUTER_PACKAGE_HASH;
            const caller = pair;
            const spenderByteArray = new CLByteArray(Uint8Array.from(Buffer.from(spender, 'hex')));
            const paymentAmount = 5000000000;
            const runtimeArgs = RuntimeArgs.fromMap({
                spender: createRecipientAddress(spenderByteArray),
                amount: CLValueBuilder.u256((liquidity * value / 100) * 10 ** 9)
            });

            let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
            let entryPoint = 'approve';

            // Set contract installation deploy (unsigned).
            let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
            console.log("make deploy: ", deploy);
            try {
                let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex)
                let result = await putdeploy(signedDeploy)
                console.log('result', result);
                let variant = "success";
                enqueueSnackbar('Approved Successfully', { variant });
            }
            catch {
                let variant = "Error";
                enqueueSnackbar('Unable to Approve', { variant });
            }

        }
        else {
            let variant = "error";
            enqueueSnackbar('Connect to Casper Signer Please', { variant });
        }
    }
    async function makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount) {
        let deploy = DeployUtil.makeDeploy(
            new DeployUtil.DeployParams(publicKey, 'casper-test'),
            DeployUtil.ExecutableDeployItem.newStoredContractByHash(
                contractHashAsByteArray,
                entryPoint,
                runtimeArgs
            ),
            DeployUtil.standardPayment(paymentAmount)
        );
        return deploy
    }

    async function signdeploywithcaspersigner(deploy, publicKeyHex) {
        let deployJSON = DeployUtil.deployToJson(deploy);
        let signedDeployJSON = await Signer.sign(deployJSON, publicKeyHex, publicKeyHex);
        let signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();

        console.log("signed deploy: ", signedDeploy);
        return signedDeploy;
    }
    async function putdeploy(signedDeploy) {
        // Dispatch deploy to node.
        const client = new CasperClient(NODE_ADDRESS);
        const installDeployHash = await client.putDeploy(signedDeploy);
        console.log(`... Contract installation deployHash: ${installDeployHash}`);
        const result = await getDeploy(NODE_ADDRESS, installDeployHash);
        console.log(`... Contract installed successfully.`, JSON.parse(JSON.stringify(result)));
        return result;
    }
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getDeploy(NODE_URL, deployHash) {
        const client = new CasperClient(NODE_URL);
        let i = 1000;
        while (i !== 0) {
            const [deploy, raw] = await client.getDeploy(deployHash);
            if (raw.execution_results.length !== 0) {
                // @ts-ignore
                if (raw.execution_results[0].result.Success) {

                    return deploy;
                } else {
                    // @ts-ignore
                    throw Error("Contract execution: " + raw.execution_results[0].result.Failure.error_message);
                }
            } else {
                i--;
                await sleep(1000);
                continue;
            }
        }
        throw Error('Timeout after ' + i + 's. Something\'s wrong');
    }
    async function RemoveLiquidityMakeDeploy() {
        setIsLoading(true)
        const publicKeyHex = activePublicKey
        if (publicKeyHex !== null && publicKeyHex !== 'null' && publicKeyHex !== undefined) {
            const publicKey = CLPublicKey.fromHex(publicKeyHex);
            const caller = ROUTER_CONTRACT_HASH;

            const tokenAAddress = tokenA.address;
            const tokenBAddress = tokenB.address;
            const token_AAmount = tokenAAmountPercent;
            const token_BAmount = tokenBAmountPercent;
            const deadline = 1739598100811;
            const paymentAmount = 20000000000;

            // const runtimeArgs = RuntimeArgs.fromMap({
            //     tokenA: createRecipientAddress(spenderByteArray),
            //     tokenB: CLValueBuilder.u256(5)
            // });
            console.log('tokenAAddress', tokenAAddress);
            const _token_a = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenAAddress.slice(5), "hex"))
            );
            const _token_b = new CLByteArray(
                Uint8Array.from(Buffer.from(tokenBAddress.slice(5), "hex"))
            );


            // const runtimeArgs = RuntimeArgs.fromMap({
            //     token_a: new CLKey(_token_a),
            //     token_b: new CLKey(_token_b),
            //     amount_a_desired: CLValueBuilder.u256(token_AAmount),
            //     amount_b_desired: CLValueBuilder.u256(token_BAmount),
            //     amount_a_min: CLValueBuilder.u256(token_AAmount / 2),
            //     amount_b_min: CLValueBuilder.u256(token_BAmount / 2),
            //     to: createRecipientAddress(publicKey),
            //     deadline: CLValueBuilder.u256(deadline),
            // });
            const runtimeArgs = RuntimeArgs.fromMap({
                token_a: new CLKey(_token_a),
                token_b: new CLKey(_token_b),
                liquidity: CLValueBuilder.u256((liquidity * value / 100) * 10 ** 9),
                amount_a_min: CLValueBuilder.u256(1 * 10 ** 9),
                amount_b_min: CLValueBuilder.u256(1 * 10 ** 9),
                to: createRecipientAddress(publicKey),
                deadline: CLValueBuilder.u256(deadline),
            });
            let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
            let entryPoint = 'remove_liquidity_js_client';

            // Set contract installation deploy (unsigned).
            let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
            console.log("make deploy: ", deploy);
            try {
                let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex)
                let result = await putdeploy(signedDeploy)
                console.log('result', result);
                let variant = "success";
                enqueueSnackbar('Liquidity Removed Successfully', { variant });
                setIsLoading(false)
            }
            catch {
                let variant = "Error";
                enqueueSnackbar('Unable to Remove Liquidity', { variant });
                setIsLoading(false)
            }

        }
        else {
            let variant = "error";
            enqueueSnackbar('Connect to Casper Signer Please', { variant });
        }
    }
    return (

        <div className="account-page">
            <div className="main-wrapper">
                <div className="home-section home-full-height">
                    <HeaderHome setActivePublicKey={setActivePublicKey} selectedNav={"Pool"} />
                    <div className="card">
                        <div className="container-fluid">
                            <div
                                className="content"
                                style={{ paddingTop: "150px", minHeight: "100vh" }}
                                position="absolute"
                            >
                                <div className="container-fluid">
                                    <div
                                        className="row"
                                        style={{ height: `${props.windowHeight}`, marginRight: "px" }}
                                    >
                                        <div className="col-md-10 offset-md-1">
                                            <div className="account-content">
                                                <div className="row align-items-center justify-content-center">
                                                    <div className="col-md-12 col-lg-6 login-right">
                                                        <>
                                                            <div className="login-header">
                                                                <h3 style={{ textAlign: "center" }}>Remove Liquidity</h3>
                                                            </div>
                                                            <form onSubmit={handleSubmitEvent} style={{ textAlign: "center" }}>
                                                                <br></br>
                                                                <RangeSlider
                                                                    style={{ width: '250px' }}
                                                                    value={value}
                                                                    onChange={e => {
                                                                        // console.log('e.target.value', e.target.value);
                                                                        setValue(e.target.value)
                                                                        setTokenAAmountPercent(tokenAAmount * e.target.value / 100)
                                                                        setTokenBAmountPercent(tokenBAmount * e.target.value / 100)
                                                                    }}
                                                                    tooltipLabel={currentValue => `${currentValue}%`}
                                                                    tooltip='on'
                                                                    size='sm'
                                                                />
                                                                {tokenA && tokenB ? (
                                                                    <>
                                                                        <Card>
                                                                            <CardContent>
                                                                                <Row>
                                                                                    <Col>
                                                                                        <CardHeader
                                                                                            title={tokenAAmountPercent}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col><CardHeader
                                                                                        avatar={<Avatar src={tokenA.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                                        title={tokenA.name}
                                                                                    /></Col>
                                                                                </Row>
                                                                                <Row>
                                                                                    <Col>
                                                                                        <CardHeader
                                                                                            title={tokenBAmountPercent}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col>
                                                                                        <CardHeader
                                                                                            avatar={<Avatar src={tokenB.logoURI} aria-label="Artist" className={classes.avatar} />}
                                                                                            title={tokenB.name}
                                                                                        />
                                                                                    </Col>
                                                                                </Row>
                                                                            </CardContent>
                                                                        </Card>
                                                                        <hr />
                                                                        <Card>
                                                                            <CardContent>
                                                                                <Row>
                                                                                    <Col>
                                                                                        <CardHeader style={{ margin: '25px' }}
                                                                                            subheader={`Price`}
                                                                                        />
                                                                                    </Col>
                                                                                    <Col>

                                                                                        <CardHeader
                                                                                            subheader={`1 ${tokenA.name} = ${tokenBAmount / tokenAAmount} ${tokenB.name}`}
                                                                                        />
                                                                                        <CardHeader
                                                                                            subheader={`1 ${tokenB.name} = ${tokenAAmount / tokenBAmount} ${tokenA.name}`}
                                                                                        />
                                                                                    </Col>
                                                                                </Row>
                                                                            </CardContent>
                                                                        </Card>
                                                                    </>
                                                                ) : (
                                                                    null
                                                                )}
                                                                <Row>
                                                                    <Col>
                                                                        {tokenA && tokenAAmount > 0 && tokenB && tokenBAmount > 0 ? (
                                                                            approveAIsLoading ? (
                                                                                <div className="text-center" style={{ marginTop: '20px' }}>
                                                                                    <Spinner
                                                                                        animation="border"
                                                                                        role="status"
                                                                                        style={{ color: "#e84646" }}
                                                                                    >
                                                                                        <span className="sr-only">Loading...</span>
                                                                                    </Spinner>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    className="btn btn-block btn-lg login-btn"
                                                                                    style={{ marginTop: '20px' }}
                                                                                    onClick={async () => {
                                                                                        setApproveAIsLoading(true)
                                                                                        await approveMakedeploy()
                                                                                        setApproveAIsLoading(false)
                                                                                    }
                                                                                    }
                                                                                >
                                                                                    Approve
                                                                                </button>
                                                                            )
                                                                        ) : (null)}
                                                                    </Col>
                                                                    <Col>
                                                                        {isLoading ? (
                                                                            <div className="text-center" style={{ marginTop: '20px' }}>
                                                                                <Spinner
                                                                                    animation="border"
                                                                                    role="status"
                                                                                    style={{ color: "#e84646" }}
                                                                                >
                                                                                    <span className="sr-only">Loading...</span>
                                                                                </Spinner>
                                                                            </div>
                                                                        ) : (
                                                                            tokenAAmountPercent !== 0 && tokenBAmountPercent !== 0 && tokenAAmount !== 0 && tokenBAmount !== 0 && tokenAAmount !== undefined && tokenBAmount !== undefined ? (
                                                                                <button
                                                                                    className="btn btn-block btn-lg login-btn"
                                                                                    onClick={async () => await RemoveLiquidityMakeDeploy()}
                                                                                    style={{ marginTop: '20px' }}
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            ) : activePublicKey === 'null' || activePublicKey === null || activePublicKey === undefined ? (
                                                                                <button
                                                                                    className="btn btn-block btn-lg "
                                                                                    disabled
                                                                                    style={{ marginTop: '20px' }}
                                                                                >
                                                                                    Connect to Signer
                                                                                </button>
                                                                            ) : (
                                                                                <button
                                                                                    className="btn btn-block btn-lg "
                                                                                    disabled
                                                                                    style={{ marginTop: '20px' }}
                                                                                >
                                                                                    Enter an Amount
                                                                                </button>
                                                                            )

                                                                        )}
                                                                    </Col>
                                                                </Row>
                                                            </form>
                                                            <br></br>
                                                            {tokenA && tokenB ? (
                                                                <Card>
                                                                    <CardContent>
                                                                        <h3>Your Position</h3>
                                                                        <Row>
                                                                            <Col>
                                                                                <CardHeader
                                                                                    subheader={`${tokenA.symbol}/${tokenB.symbol}`}
                                                                                />
                                                                            </Col>
                                                                            <Col style={{ textAlign: 'right' }}>
                                                                                <CardHeader
                                                                                    subheader={liquidity}
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <CardHeader
                                                                                    subheader={`${tokenA.name}:`}
                                                                                />
                                                                            </Col>
                                                                            <Col style={{ textAlign: 'right' }}>
                                                                                <CardHeader
                                                                                    subheader={tokenAAmount}
                                                                                />
                                                                            </Col>

                                                                        </Row>
                                                                        <Row>
                                                                            <Col>
                                                                                <CardHeader
                                                                                    subheader={`${tokenB.name}:`}
                                                                                />
                                                                            </Col>
                                                                            <Col style={{ textAlign: 'right' }}>
                                                                                <CardHeader
                                                                                    subheader={tokenBAmount}
                                                                                />
                                                                            </Col>

                                                                        </Row>
                                                                    </CardContent>
                                                                </Card>
                                                            ) : (
                                                                null
                                                            )}
                                                        </>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default windowSize(RemoveLiquidity);
