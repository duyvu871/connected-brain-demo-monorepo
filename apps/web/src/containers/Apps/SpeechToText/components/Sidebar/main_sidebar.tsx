import React from 'react';
import { Center, Drawer } from '@mantine/core';
import { IoIosArrowForward } from 'react-icons/io';
import ContentSidebar from '@/containers/Apps/SpeechToText/components/Sidebar/content_sidebar';


function MainSidebar() {
	const [opened, setOpened] = React.useState<boolean>(false);
	const closeDrawer = () => setOpened(false);
	const openDrawer = () => setOpened(true);
	const toggleDrawer = () => setOpened((o) => !o);
	return (
		<Center className="w-fit xl:w-44 transition-all" h="100%">
			<ContentSidebar className="hidden xl:flex" />
			<Center className="pl-3">
				<Center className="xl:[display:none!important] bg-gray-800 py-4 px-1 rounded-lg cursor-pointer"
								onClick={openDrawer}>
					<IoIosArrowForward />
				</Center>
			</Center>
			<Drawer
				className="xl:hidden"
				classNames={{
					inner: 'left-0',
					body: 'flex-grow',
				}}
				onClose={closeDrawer}
				opened={opened}
				overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
				size="xs"
				styles={{
					content: {
						backgroundColor: '#111827',
						width: '100px',
						// '--drawer-flex': '0.4',
						display: 'flex',
						flexDirection: 'column',
					},
					body: {
						flexGrow: 1,
					},
					title: {
						backgroundColor: '#111827',
					},
					header: {
						backgroundColor: '#111827',
					},
					close: {
						backgroundColor: '#111827',
					},
				}}
				zIndex={1000}
			>
				<ContentSidebar />
			</Drawer>
		</Center>
	);
}

export default MainSidebar;