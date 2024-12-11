import { Alert, Modal, ScrollView, StatusBar, Text, useWindowDimensions, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import { Loading } from "@/components/loading";
import { Cover } from "@/components/market/cover";
import { Details, DetailsProps } from "@/components/market/details";
import { Coupon } from "@/components/market/coupon";
import { Button } from "@/components/button";
import { CameraView, useCameraPermissions } from "expo-camera";
import { colors } from "@/styles/theme"

type DataProps = DetailsProps & {
    cover: string;
}

export default function Market() {
    const dimensions = useWindowDimensions();
    const params = useLocalSearchParams<{ id: string }>();
    const qrLock = useRef(false)
    const [data, setData] = useState<DataProps | null>(null);
    const [coupon, setCoupon] = useState<string | null>(null);
    const [isVisibleCameraModal, setIsVisibleCameraModal] = useState<boolean>(false);
    const [couponIsFeching, setCouponIsFeching] = useState<boolean>(false);
    const [_permission, requestPermission] = useCameraPermissions();


    async function fetchMarket() {
        try {
            const { data } = await api.get(`/markets/${params.id}`)
            setData(data)
        } catch(error) {
            console.log(error)
            Alert.alert('Erro', 'Não foi possível carregar os dados', [
                { 
                    text: 'OK',
                    onPress: () => router.back()
                }
            ])
        }
    }

    async function handleOpenCamera() {
        try {
            const { granted } = await requestPermission()

            if (!granted) {
                return Alert.alert('Câmera', 'Você precisa habilitar o uso da câmera')
            }

            qrLock.current = false
            setIsVisibleCameraModal(true)
        } catch(error) {
            console.log(error)
            Alert.alert('Câmera', 'Não foi possível utilizar a câmera')
        }
    }

    async function getCoupon(id: string) {
        try {
            console.log('teste', id)
            setCouponIsFeching(true);

            const { data } = await api.patch(`/coupons/${id}`);
            Alert.alert('Cupom', data.coupon)
            setCoupon(data.coupon)
        } catch(error) {
            console.log(error)
            Alert.alert('Error', 'Não foi possível utilizar o cupom')
        } finally {
            setCouponIsFeching(false)
        }
    }

    function handleUseCoupon(id: string) {
        setIsVisibleCameraModal(false);
        Alert.alert(
            'Cupom',
            'Não é possível reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?',
            [
                { style: 'cancel', text: 'Não'},
                { text: 'Sim', onPress: () => getCoupon(id) }
            ]
        )
    }

    useEffect(() => {
        fetchMarket()
    }, [params.id, coupon])

    if (!data) {
        return <Loading />
    }
    console.log(isVisibleCameraModal)
    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle='default' hidden={isVisibleCameraModal}/>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Cover uri={data.cover}/>
                <Details data={data}/>
                {coupon && <Coupon code={'FM4345T6'} />}
            </ScrollView>

            <View style={{ padding: 32 }}>
                <Button onPress={handleOpenCamera}>
                    <Button.Title>Ler QR Code</Button.Title>
                </Button>
            </View>

            <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
                <CameraView 
                    style={{ flex: 1}}
                    facing="back"
                    onBarcodeScanned={({ data }) => {
                        if (data && !qrLock.current) {
                            qrLock.current = true;
                            setTimeout(() => {
                                handleUseCoupon(data)
                            }, 500)
                        }
                    }}
                />

                <View style={{
                    position: 'absolute',
                    height: '40%',
                    borderColor: colors.red.base,
                    borderWidth: 4,
                    top: dimensions.height * 0.2,
                    bottom: dimensions.height * 0.3,
                    left: 40,
                    right: 40
                }} />

                <View style={{
                    position: 'absolute',
                    bottom: 32,
                    left: 32,
                    right: 32,
                }}>
                    <Button 
                        onPress={() => setIsVisibleCameraModal(false)}
                        isLoading={couponIsFeching}
                    >
                        <Button.Title>Voltar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}