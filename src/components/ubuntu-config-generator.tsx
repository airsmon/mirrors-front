import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Switch,
  FormGroup,
} from '@mui/material';
import { Trans } from 'gatsby-plugin-react-i18next';
import CodeBlock from './code-block';

const ubuntuVersionMap: Record<number | string, string> = {
  2404: 'noble',
  2310: 'mantic',
  2304: 'lunar',
  2210: 'kinetic',
  2204: 'jammy',
  2004: 'focal',
  1804: 'bionic',
  1604: 'xenial',
  1404: 'trusty',
};

const isLTSVersion = (version: number) => {
  return Math.floor(version / 100) % 2 === 0 && version % 100 === 4;
};

const configGenOld = (
  version: number | string,
  enableHTTPS: boolean,
  enableSrc: boolean,
  enableProposed: boolean,
  enableSecurity: boolean,
  ubuntuVariant: string
) => {
  const ubuntuName = ubuntuVersionMap[version];
  const httpProtocol = enableHTTPS ? 'https' : 'http';
  const debSrcText = enableSrc ? '' : '# ';
  const proposedText = enableProposed ? '' : '# ';
  const securityRepo = enableSecurity
    ? 'mirrors.idc.daocloud.io'
    : 'security.ubuntu.com';
  return `deb ${httpProtocol}://mirrors.idc.daocloud.io/${ubuntuVariant}/ ${ubuntuName} main restricted universe multiverse
  ${debSrcText}deb-src ${httpProtocol}://mirrors.idc.daocloud.io/${ubuntuVariant}/ ${ubuntuName} main restricted universe multiverse
  deb ${httpProtocol}://mirrors.idc.daocloud.io/${ubuntuVariant}/ ${ubuntuName}-updates main restricted universe multiverse
  ${debSrcText}deb-src ${httpProtocol}://mirrors.idc.daocloud.io/${ubuntuVariant}/ ${ubuntuName}-updates main restricted universe multiverse
  deb ${httpProtocol}://mirrors.idc.daocloud.io/${ubuntuVariant}/ ${ubuntuName}-backports main restricted universe multiverse
  ${debSrcText}deb-src ${httpProtocol}://mirrors.idc.daocloud.io/${ubuntuVariant}/ ${ubuntuName}-backports main restricted universe multiverse
  
  deb ${httpProtocol}://${securityRepo}/${ubuntuVariant}/ ${ubuntuName}-security main restricted universe multiverse
  ${debSrcText}deb-src ${httpProtocol}://${securityRepo}/${ubuntuVariant}/ ${ubuntuName}-security main restricted universe multiverse
  ${proposedText}deb ${httpProtocol}://mirrors.idc.daocloud.io/${ubuntuVariant}/ ${ubuntuName}-proposed main restricted universe multiverse
  ${proposedText}${debSrcText}deb-src ${httpProtocol}://mirrors.idc.daocloud.io/${ubuntuVariant}/ ${ubuntuName}-proposed main restricted universe multiverse`;
};

const configGenNew = (
  version: number | string,
  enableHTTPS: boolean,
  enableSrc: boolean,
  enableProposed: boolean,
  enableSecurity: boolean,
  ubuntuVariant: string
) => {
  const ubuntuName = ubuntuVersionMap[version];
  const httpProtocol = enableHTTPS ? 'https' : 'http';
  const debSrcText = enableSrc ? ' deb-src' : '';
  const securityRepo = enableSecurity
    ? 'mirrors.zju.edu.cn'
    : 'security.ubuntu.com';
  let sources = `Types: deb${debSrcText}
  URIs: ${httpProtocol}://mirrors.idc.daocloud.io/${ubuntuVariant}/
  Suites: ${ubuntuName} ${ubuntuName}-updates ${ubuntuName}-backports
  Components: main restricted universe multiverse
  Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
  \u200b
  Types: deb${debSrcText}
  URIs: ${httpProtocol}://${securityRepo}/${ubuntuVariant}/
  Suites: ${ubuntuName}-security
  Components: main restricted universe multiverse
  Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
  `;
  if (enableProposed) {
    sources += `\u200b
  Types: deb${debSrcText}
  URIs: ${httpProtocol}://mirrors.idc.daocloud.io/${ubuntuVariant}/
  Suites: ${ubuntuName}-proposed
  Components: main restricted universe multiverse
  Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
  `;
  }
  return sources;
};

export default ({ ubuntuVariant }: { ubuntuVariant: string }) => {
  const [version, setVersion] = useState(
    Object.keys(ubuntuVersionMap)
      .reverse()
      .filter(v => isLTSVersion(parseInt(v, 10)))[0]
  );
  const [enableHTTPS, setEnableHTTPS] = useState(true);
  const [enableSrc, setEnableSrc] = useState(false);
  const [enableProposed, setEnableProposed] = useState(false);
  const [enableSecurity, setEnableSecurity] = useState(true);
  const shouldUseNewConf = () => parseInt(version, 10) >= 2404;

  return (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-end"
      >
        <Grid item sx={{ mb: 1 }}>
          <Typography component="p">��ѡ������ Ubuntu �汾��</Typography>
        </Grid>
        <Grid item>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">
              <Trans>�汾</Trans>
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              label="Age"
              onChange={event => {
                setVersion(event.target.value as string);
              }}
              defaultValue={version}
            >
              {Object.keys(ubuntuVersionMap)
                .reverse()
                .map((v: string) => {
                  const item = parseInt(v, 10);
                  let desc = (item / 100).toFixed(2);
                  if (isLTSVersion(item)) desc += ' LTS';
                  desc += ` (${ubuntuVersionMap[item]})`;
                  return (
                    <MenuItem key={item} value={item}>
                      {desc}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={enableHTTPS}
              onChange={e => setEnableHTTPS(e.target.checked)}
            />
          }
          label="���� HTTPS ������������ܲ�֧�֣�"
        />
        <FormControlLabel
          control={
            <Switch
              checked={enableSrc}
              onChange={e => setEnableSrc(e.target.checked)}
            />
          }
          label="����Դ��Դ��Ĭ�Ͻ���������ٶȣ�"
        />
        <FormControlLabel
          control={
            <Switch
              checked={enableProposed}
              onChange={e => setEnableProposed(e.target.checked)}
            />
          }
          label="����Ԥ�������Դ�����������ã�"
        />
        <FormControlLabel
          control={
            <Switch
              checked={enableSecurity}
              onChange={e => setEnableSecurity(e.target.checked)}
            />
          }
          label="���ð�ȫ���¾��񣨽��Ƽ�У�������ã�"
        />
      </FormGroup>
      <Grid container direction="row" my={2}>
        <Typography>�ð汾 Ubuntu ��Ĭ�����Դ�����ļ���</Typography>
        <code
          style={{ margin: '0 0.5rem', fontWeight: 'bold', color: 'brown' }}
        >
          {shouldUseNewConf()
            ? '/etc/apt/sources.list.d/ubuntu.sources'
            : '/etc/apt/sources.list'}
        </code>
        <Typography>
          ����ϵͳ�Դ��ĸ��ļ��������ݣ������ļ��滻Ϊ�������ݣ�����ʹ�����ǵ����Դ����
        </Typography>
        {shouldUseNewConf() && (
          <>
            <Typography style={{ fontWeight: 'bold' }}>
              ������Ӿɰ汾 Ubuntu �������ð汾��������Ҫͬʱ���ݲ����
            </Typography>
            <code style={{ margin: '0 0.5rem', fontWeight: 'bold' }}>
              /etc/apt/sources.list
            </code>
            <Typography style={{ fontWeight: 'bold' }}>�����ݡ�</Typography>
          </>
        )}
      </Grid>
      <CodeBlock language="bash">
        {shouldUseNewConf()
          ? configGenNew(
              version,
              enableHTTPS,
              enableSrc,
              enableProposed,
              enableSecurity,
              ubuntuVariant
            )
          : configGenOld(
              version,
              enableHTTPS,
              enableSrc,
              enableProposed,
              enableSecurity,
              ubuntuVariant
            )}
      </CodeBlock>
    </Box>
  );
};
