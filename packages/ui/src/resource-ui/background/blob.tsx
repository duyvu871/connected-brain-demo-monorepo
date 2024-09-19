import styled from 'styled-components';

export default function BlobAnimation() {
	return <Blob />
}

const Blob = styled.div`
		position: absolute;
		width: 500px;
		height: 500px;
		background: linear-gradient(135deg, #e0e0e0, #9e9e9e);
		border-radius: 24% 76% 35% 65% / 27% 36% 64% 73%;
		mix-blend-mode: color-dodge;
`