import Loader from '@/components/common/Loader';
export default function WaitingRoom() {
    return (<div className="max-w-md mx-auto text-center">
      <Loader label="Waiting for the host to start the Baithak…"/>
    </div>);
}
